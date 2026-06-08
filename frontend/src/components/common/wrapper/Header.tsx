type Props = {
  title: string;
  components: React.ReactNode;
};

export default function Header({ title, components }: Props) {
  return (
    <div className="bg-C3 py-1 px-4 flex flex-row items-center justify-between">
      <div className=" font-mulish py-2 font-semibold  ">{title}</div>
      <div>{components}</div>
    </div>
  );
}
