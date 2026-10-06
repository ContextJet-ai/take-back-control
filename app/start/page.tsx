import { Wizard } from "@/components/wizard/wizard";
import { NoUploadNotice } from "@/components/no-upload-notice";

export const metadata = { title: "Start" };

export default function StartPage() {
  return (
    <>
      <div className="mx-auto max-w-xl px-4 pt-8"><NoUploadNotice /></div>
      <Wizard />
    </>
  );
}
