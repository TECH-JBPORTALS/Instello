import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@instello/ui/components/avatar'

const members = [
  {
    name: 'Narayana R',
    designation: 'Founder & Trainer',
    img: '/team/narayana.jpg',
  },
  {
    name: 'Gayathri Emparala',
    designation: 'Co-Founder',
    img: '/team/gayathri.jpg',
  },
  {
    name: 'Manoj M',
    designation: 'Developer',
    img: '/team/manoj.jpg',
  },

  {
    name: 'Kshama Gururaj Chimmalgi',
    designation: 'Trainer',
    img: '/team/kshama.jpg',
  },
  {
    name: 'Srinithi Ashokan',
    designation: 'Trainer',
    img: '/team/srinithi.png',
  },
  {
    name: 'Devendra P',
    designation: 'Trainer',
    img: '/team/devendra.jpg',
  },
  {
    name: 'Akash Bhandari G',
    designation: 'Trainer',
    img: '/team/akash.jpg',
  },
]

export function MembersList() {
  return (
    <section className="flex w-full justify-center pb-20">
      <div className="grid w-fit grid-cols-2 items-center gap-8 md:grid-cols-3 lg:grid-cols-4">
        {members.map((mem, i) => (
          <div key={i} className="flex w-full flex-col items-center gap-4">
            <Avatar className="size-24 border-r-2 shadow-md shadow-black/20 md:size-32">
              <AvatarImage src={mem.img} className="object-cover" />
              <AvatarFallback>
                <div className="from-foreground bg-linear-to-tl! to-foreground/20 bg-clip-text text-4xl  font-bold text-transparent ">
                  {mem.name.charAt(0)}
                </div>
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-semibold">{mem.name}</p>
              <span className="text-muted-foreground text-sm">
                {mem.designation}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
