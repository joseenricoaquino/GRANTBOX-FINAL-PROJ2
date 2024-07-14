import ChatButton from "@/components/global/chat/ChatButton";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children} <ChatButton />
    </div>
  );
}
