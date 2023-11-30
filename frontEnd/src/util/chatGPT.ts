import { Configuration, OpenAIApi } from 'openai';

export async function chatGPT({ prompt }: {
    prompt: string
}) {
    try {
        const openai = new OpenAIApi(new Configuration({
            apiKey: process.env.REACT_APP_OPENAI_API_KEY
        }));

        const completion: any = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 2048,
        });
        // console.log(JSON.stringify(completion,null,2));

        return {
            data: (completion.data.choices[0].text).trim()
        };
    }
    catch (error: any) {
        if (error.response) console.log(error.response.status, error.response.data);
        else console.log(error.message);

        return {
            err: error.message
        }
    }
}