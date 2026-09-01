/* 区块标题：焦糖色竖线 + 衬线标题 */

export default function SectionTitle({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className="h-4 w-[3px] rounded-full bg-accent" />
      <h2
        id={id}
        className="font-serif text-[17px] font-semibold tracking-wide text-foreground"
      >
        {children}
      </h2>
    </div>
  );
}
