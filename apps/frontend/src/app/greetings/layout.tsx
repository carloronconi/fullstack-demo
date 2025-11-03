export default function GreetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2>Greetings Layout</h2>
      <div>{children}</div>
    </div>
  );
}
