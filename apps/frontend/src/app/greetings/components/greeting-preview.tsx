type Props = {
  content: string;
  id: string;
  countryCode: string;
  createdAt: Date;
};

export default function GreetingPreview({
  content,
  id,
  countryCode,
  createdAt,
}: Props) {
  return (
    <div key={id}>
      <h3>{content}</h3>
      <div>
        <p>ID: {id}</p>
        <p>Country: {countryCode}</p>
        <p>Created: {createdAt.toDateString()}</p>
      </div>
    </div>
  );
}
