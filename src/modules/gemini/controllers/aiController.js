import XLSX from "xlsx";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const correctDescriptions = async (req, res) => {
    try {
        const workbook = XLSX.readFile("src/files/forSentenceCorrection - Sheet1.csv")

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(sheet);

        const descriptions = data
            .map(row => row.Description)
            .filter(Boolean);

        const prompt = `
Rewrite each description into a concise, professional summary.

Rules:
- Maximum 1-2 lines per description.
- Preserve the original meaning.
- Fix grammar and spelling.
- Remove unnecessary words.
- Return ONLY a JSON array.

Descriptions:
${JSON.stringify(descriptions)}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        const correctedDescriptions = JSON.parse(response.text);

        console.log("LINE35", correctedDescriptions);

        // return res.status(200).json({
        //     success: true,
        //     total: correctedDescriptions.length,
        //     data: correctedDescriptions,
        // });
    } catch (error) {
        console.error(error);

        // return res.status(500).json({
        //   success: false,
        //   message: error.message,
        // });
    }
};