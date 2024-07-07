"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface CancelProps {
id: string;
}

const Cancel: React.FC<CancelProps> = ({ id }) => {
const router = useRouter();

const handleCancel = async () => {
try {
    if (confirm("회원 탈퇴 하시겠습니까?")) {
    const res = await fetch("/api/auth/delete", {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id }),
    });
    console.log(res);
    window.location.reload();
    }
} catch (error) {
    console.error("회원탈퇴 실패", error);
}
};

return (
<button onClick={handleCancel} className="text-sm">
    회원탈퇴
</button>
);
};

export default Cancel;
