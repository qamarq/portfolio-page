import 'server-only'

const verifyEndpoint = "https://www.google.com/recaptcha/api/siteverify";

export const verifyCaptcha = async (captcha: string) => {
    const captchaResponse = await fetch(verifyEndpoint, {
        method: "POST",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET!, // See prior section
            response: captcha, // the user's generated "Captcha" token
        }),
    }).then((res) => res.json());

    if (!captchaResponse.success) {
        return { error: "Captcha error" };
    } else {
        return { success: "Captcha verified" };
    }
}