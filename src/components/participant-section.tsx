import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import participants from "@/participants/data.json";

export default function ParticipantsSection() {
  return (
    <section className="w-lg max-w-3xl mx-auto mt-10 space-y-6">
      <h2 className="text-center font-extrabold text-3xl">Participantes</h2>

      <div className="flex flex-col divide-y divide-border rounded-md border border-border shadow-sm bg-background">
        {participants.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between p-4 hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={p.imageUrl ?? ""} alt={p.name} />
                  <AvatarFallback>
                    {p.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Indicador de estado */}
                <span
                  className={`absolute bottom-1 right-1 h-4.5 w-4.5 rounded-full border-2 border-background ${
                    p.participated ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
              </div>

              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-foreground">{p.name}</span>
                <span className="text-sm text-muted-foreground">
                  Matrícula: {p.id}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-green-500 h-3 w-3 rounded-full"></div>
            <span className="font-medium text-foreground">Participó</span>
          </div>
          |
          <div className="flex items-center gap-2">
            <div className="bg-red-500 h-3 w-3 rounded-full"></div>
            <span className="font-medium text-foreground">No participó</span>
          </div>
        </div>
      </div>
    </section>
  );
}
