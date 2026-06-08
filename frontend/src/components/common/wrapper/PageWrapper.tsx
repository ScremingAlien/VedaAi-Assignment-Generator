export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <section className=" w-full h-full flex relative flex-col justify-between">{children}</section>
  );
}
