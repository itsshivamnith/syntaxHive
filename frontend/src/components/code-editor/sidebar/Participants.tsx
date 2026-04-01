import type { Participant } from "../SideBar";

interface ParticipantsProps {
  participants: Participant[];
}

const Participants = ({ participants }: ParticipantsProps) => {
  return (
    <div className="m-4 border border-gray-600 rounded-md flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-gray-600 p-4 gap-4">
        <h1>Contributors</h1> <p>{participants.length}</p>
      </div>
      <ul className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
        {participants.map((p) => (
          <li className="flex items-center gap-2" key={p.id}>
            <img className="size-10 rounded-full" src='/profile-placeholder.png' alt="" />
            {p.name}
            </li>
        ))}
      </ul>
    </div>
  );
};

export default Participants;
