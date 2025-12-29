import Image from "next/image";

const associatesData = [
  { image: "/ksp.png", name: "KS Polytechnic" },
  { image: "/ksp.png", name: "KS Polytechnic" },
  { image: "/ksp.png", name: "KS Polytechnic" },
  { image: "/ksp.png", name: "KS Polytechnic" },
  { image: "/ksp.png", name: "KS Polytechnic" },
  { image: "/ksp.png", name: "KS Polytechnic" },
];

export function Associates() {
  return (
    <section className="flex flex-col items-center gap-14 py-14">
      <div className="text-muted-foreground font-mono text-xl font-semibold">
        Associated Institutions
      </div>
      <div className="flex flex-wrap justify-center gap-10">
        {associatesData.map((v, i) => (
          <Image
            key={i}
            src={v.image}
            alt={v.name}
            className="transition-all duration-300"
            height={140}
            width={140}
          />
        ))}
      </div>
    </section>
  );
}
