import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

export class AIService {
    private model: ChatOpenAI;

    constructor() {
        this.model = new ChatOpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            temperature: 0,
            modelName: "gpt-4o-mini"
        });
    }

    async parseRFPRequest(naturalLanguage: string) {
        const schema = z.object({
            title: z.string().describe("A short title for the procurement request"),
            budget: z.number().optional().describe("Total budget found in text, return 0 if not found"),
            deadline: z.string().optional().describe("ISO Date string for deadline, or calculate based on 'in 30 days'"),
            items: z.array(z.object({
                item_name: z.string(),
                quantity: z.number(),
                specs: z.string().describe("Technical specifications or details")
            }))
        });

        const parser = StructuredOutputParser.fromZodSchema(schema);
        const prompt = new PromptTemplate({
            template: "Extract structured RFP data from the following text.\n{format_instructions}\n\nText: {text}",
            inputVariables: ["text"],
            partialVariables: { format_instructions: parser.getFormatInstructions() }
        });

        const input = await prompt.format({ text: naturalLanguage });
        const response = await this.model.invoke(input);
        
        const content = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
        return parser.parse(content);
    }

    async parseVendorResponse(emailBody: string) {
        const schema = z.object({
            price: z.number().describe("Total price quoted"),
            timeline: z.string().describe("Delivery timeline mentioned"),
            warranty: z.string().describe("Warranty terms mentioned"),
            summary: z.string().describe("A 2 sentence summary of the proposal key points")
        });

        const parser = StructuredOutputParser.fromZodSchema(schema);
        const prompt = new PromptTemplate({
            template: "Analyze this vendor email response and extract key commercial terms.\n{format_instructions}\n\nEmail: {email}",
            inputVariables: ["email"],
            partialVariables: { format_instructions: parser.getFormatInstructions() }
        });

        const input = await prompt.format({ email: emailBody });
        const response = await this.model.invoke(input);
        
        const content = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
        return parser.parse(content);
    }

    async compareProposals(rfpContext: string, proposals: any[]) {
        const prompt = new PromptTemplate({
            template: `
            You are a procurement expert. 
            RFP Requirement: {rfpContext}
            
            Vendor Proposals: 
            {proposals}

            Rank these vendors from best to worst. Provide a score (0-100) and a reasoning for each.
            Return a valid JSON array: [{{ "vendor_id": "...", "score": 90, "reason": "..." }}]
            `,
            inputVariables: ["rfpContext", "proposals"]
        });

        const input = await prompt.format({
            rfpContext: rfpContext,
            proposals: JSON.stringify(proposals)
        });

        const response = await this.model.invoke(input);
        // Basic cleaning to ensure JSON
        const content = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
        // Often LLMs wrap code in backticks, simplistic strip here:
        const cleanJson = content.replace(/```json/g, "").replace(/```/g, "");
        return JSON.parse(cleanJson);
    }
}