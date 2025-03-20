import { redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { Button, Input } from "@material-tailwind/react";
import { prisma } from "../utils/db.server";
import { verifyPassword } from "../utils/auth";
import { sessionStorage } from "../utils/session.server";

type ActionData = {
  error?: string;
};

export const action = async ({ request }: { request: Request }) => {
  const data = new URLSearchParams(await request.text());
  const username = data.get("username")!;
  const password = data.get("password")!;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return new Response(JSON.stringify({ error: "User Not Found!" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    const pwd = await verifyPassword(user.password, password);
    if (!pwd) {
      return new Response(JSON.stringify({ error: "Invalid Password!" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    const session = await sessionStorage().getSession();
    session.set("usr", user.id);
    return redirect("/admin", {
      headers: {
        "Set-Cookie": await sessionStorage().commitSession(session),
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Internal Server Error!" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export default function Login() {
  const data = useActionData<ActionData>();
  return (
    <main className="w-4/5 min-h-screen pt-12 m-auto">
      <Form
        method="post"
        className="w-1/5 border-2 border-black rounded p-4 mt-48 mx-auto flex flex-col items-center"
      >
        {data?.error && <div className="text-red-500 mb-4">{data.error}</div>}
        <Input
          placeholder="Username"
          name="username"
          type="text"
          className="border-2 border-teal-500 my-2"
          required
        >
          <Input.Icon>
            <i className="fa-light fa-user-crown"></i>
          </Input.Icon>
        </Input>
        <Input
          placeholder="Password"
          name="password"
          type="password"
          className="border-2 border-teal-500 my-2"
          required
        >
          <Input.Icon>
            <i className="fa-light fa-lock"></i>
          </Input.Icon>
        </Input>
        <Button variant="outline" className="border-2 border-black">
          <i className="fa-light fa-rocket-launch"></i>
        </Button>
      </Form>
    </main>
  )
}