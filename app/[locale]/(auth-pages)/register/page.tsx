import { AuthPage } from "@components/AuthComponents/auth-page";
import { getData } from "@hooks/getData";
import { redirect } from "next/navigation";

export default async function Register() {
    const data = await getData();

    if (data.authenticated) {
        redirect(data?.redirectTo || "/home");
    }

    return <AuthPage type="register" />;
}
