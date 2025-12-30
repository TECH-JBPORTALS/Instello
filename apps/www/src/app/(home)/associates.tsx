import Image from "next/image";

const associatesData = [
  { image: "/institutes/ksp.png", name: "KS Polytechnic" },
  { image: "/institutes/dsit.png", name: "DSIT" },
  { image: "/institutes/pvp.png", name: "PVP Polytechnic" },
  { image: "/institutes/sct.png", name: "SCT Institutions" },
  { image: "/institutes/sjes.png", name: "SJES" },
  { image: "/institutes/vasavi.png", name: "Vasavi" },
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
            title={v.name}
            className="transition-all duration-300"
            height={120}
            width={120}
          />
        ))}
      </div>
    </section>
  );
}
