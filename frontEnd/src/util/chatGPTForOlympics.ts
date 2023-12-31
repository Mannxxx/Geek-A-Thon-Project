import { chatGPT } from './chatGPT';

export async function chatGPTForOlympics({ txt }: {
    txt: string
}) {

    const { err, data: flag } = await chatGPT({
        prompt: `give answer true if quoted text related to sports,sports player, olympics, indoor or outdoor games or field "${txt}" else false"`
    });

    if (err) return err;

    if (flag.includes('true') || flag.includes('True')) {
        const { err, data } = await chatGPT({ prompt: txt });

        if (err) return err;
        return data;
    }
    else return "Sorry, this question is not related to the olympics."
}