"use client";
import useCurrentUser from "@/actions/useCurrentUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { MessageCircleCode, Minimize2, SendIcon } from "lucide-react";
import React, { FormEvent, useState } from "react";
import useFAQ from "./useFAQ";
import { FAQ } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ChatButton = () => {
  const [open, setOpen] = useState(false);
  const buttonClassName = clsx(
    "transition-all z-[110] border",
    open
      ? "p-1.5 bg-white text-main-500 rounded-b-full w-10 h-10"
      : "p-2.5 hover:scale-110 hover:-translate-y-1 hover:bg-main-500 hover:text-white hover:shadow-lg bg-white text-main-500 rounded-full w-14 h-14"
  );

  const boxClassName = clsx(
    "w-[30rem] h-[30rem] bg-white rounded-md absolute bottom-full right-0 border p-3 flex flex-col transition-opacity duration-500 z-[110]",
    open ? "opacity-100" : "opacity-0 pointer-events-none"
  );

  const [question, setQuestion] = useState("");
  const [convo, setConvo] = useState<FAQ[]>([]);

  const currentUser = useCurrentUser();
  const faqs = useFAQ();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const newConvo = faqs.data?.find((d) => d.id === question);
    if (newConvo) {
      setConvo((prev) => [newConvo, ...prev]);
    }
    setQuestion("");
  }

  if (currentUser.data?.role === "ADMINISTRATOR") return null;
  return (
    <div className="fixed bottom-4 right-4">
      {open && (
        <div className={boxClassName}>
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2"
            size={"icon"}
            variant={"outline"}
          >
            <Minimize2 />
          </Button>

          <h2 className="font-bold text-main-500">Help Desk</h2>
          <ul className="flex-1 flex flex-col-reverse gap-2">
            {convo.map((val) => {
              return (
                <li key={val.id} className="flex flex-col gap-2">
                  <div className="flex-1 flex justify-end items-center">
                    <p className="p-2 rounded-md bg-blue-400 text-left text-xs">
                      {val.question}
                    </p>
                  </div>
                  <div className="flex-1 flex justify-start items-center">
                    <p className="p-2 rounded-md bg-slate-300 text-right text-xs">
                      {val.response}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <form onSubmit={onSubmit} className="w-full flex gap-2 mt-3">
            <Select onValueChange={(e) => setQuestion(e)} value={question}>
              <SelectTrigger className={""}>
                <SelectValue
                  placeholder={
                    "Enter what help you want to be provided with..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {faqs.data &&
                  faqs.data?.map((c) => {
                    return (
                      <SelectItem key={c.id} value={c.id}>
                        {c.question}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
            <Button
              size={"icon"}
              type="submit"
              className="h-full aspect-square p-2"
            >
              <SendIcon className="w-full h-full" />
            </Button>
          </form>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={buttonClassName}
      >
        <MessageCircleCode className="w-full h-full" />
      </button>
    </div>
  );
};

export default ChatButton;
