export default async function GreetingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const backendOrigin = process.env.BACKEND_ORIGIN;
  if (!backendOrigin) {
    throw new Error("BACKEND_ORIGIN is not configured");
  }

  const greeting = await fetch(`${backendOrigin}/greetings/${slug}`).then(
    (res) => {
      if (!res.ok) {
        throw new Error("Greeting not found");
      }
      return res.json();
    }
  );
  return <h1>Greetings Page for {JSON.stringify(greeting)}</h1>;
}
