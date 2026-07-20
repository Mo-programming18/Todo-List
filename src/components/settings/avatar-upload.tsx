"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2, Upload } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { removeAvatar, updateAvatar } from "@/server/actions/user";
import { initialsFromUser } from "@/lib/format";
import {
  ACCEPTED_AVATAR_TYPES,
  MAX_AVATAR_BYTES,
} from "@/lib/validations/settings";

export function AvatarUpload({
  name,
  email,
  image,
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [preview, setPreview] = useState<string | null>(image ?? null);

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Reset so selecting the same file again still fires onChange.
    event.target.value = "";
    if (!file) return;

    if (!ACCEPTED_AVATAR_TYPES.includes(file.type as never)) {
      toast.error("Use a JPG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("Image must be 4 MB or smaller.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setPending(true);

    const formData = new FormData();
    formData.append("avatar", file);
    const result = await updateAvatar(formData);

    setPending(false);
    URL.revokeObjectURL(objectUrl);

    if (!result.ok) {
      setPreview(image ?? null);
      toast.error(result.error);
      return;
    }

    setPreview(result.image);
    toast.success("Photo updated.");
    // Refresh server components so the navbar avatar updates too.
    router.refresh();
  }

  async function onRemove() {
    setPending(true);
    const result = await removeAvatar();
    setPending(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setPreview(null);
    toast.success("Photo removed.");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-16">
        {preview && <AvatarImage src={preview} alt="" />}
        <AvatarFallback className="text-base">
          {initialsFromUser(name, email)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-start gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_AVATAR_TYPES.join(",")}
          className="hidden"
          onChange={onFileChange}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
          >
            {pending ? <Loader2 className="animate-spin" /> : <Upload />}
            {preview ? "Change photo" : "Upload photo"}
          </Button>
          {preview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={onRemove}
            >
              <Trash2 />
              Remove
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          JPG, PNG, WebP, or GIF. Max 4 MB.
        </p>
      </div>
    </div>
  );
}
