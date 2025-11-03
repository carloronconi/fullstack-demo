type Props = {
  children: React.ReactNode;
  title: string;
};

export default function PaginatedList({ children, title }: Props) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
