"use client";

import { useUser } from "@/hooks/useUser";
import { useBlock } from "@/hooks/useBlock";
import { supabase } from "@/libs/SupabaseClient";
import { useState, useEffect } from "react";
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/Skeleton";
import { Button as ButtonUI } from "@/components/ui/Button";
import { GripHorizontal } from "lucide-react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import BlockStore from "@/components/clinet/admin/profiles/BlockStore";
import { componentMap, propsMap } from "@/components/blocks/Registry";

type Block = {
    id: string;
    lock: string;
    content: any[];
    redirect?: string;
    component?: string;
};

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const adjustedTransform = transform ? { ...transform, x: 0 } : null;
    const style = { transform: CSS.Transform.toString(adjustedTransform), transition: isDragging ? undefined : transition, zIndex: isDragging ? 1 : undefined };

    return (
        <div ref={setNodeRef} className="flex flex-col h-auto w-full justify-center items-center bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-900" style={style} {...attributes}>
            <ButtonUI className="w-full cursor-pointer rounded-none pt-1 pb-1 bg-transparent dark:bg-transparent hover:bg-transparent hover:dark:bg-transparent shadow-none" {...listeners}><GripHorizontal className="text-neutral-950 dark:text-neutral-50 w-full" size={20} /></ButtonUI>
            {children}
        </div>
    );
}

export default function Block() {
    const { loading } = useUser();
    const { block } = useBlock();
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [fadeOut, setFadeOut] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (block) {
            const newBlocks: Block[] = block.map((b: any) => ({
                id: b.id,
                lock: b.lock || "",
                content: b.content || [],
                redirect: b.redirect,
                component: b.component || "Button",
            }));
            setBlocks(newBlocks);
            setIsLoading(false);
        }
    }, [block]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            toast("Updating...");
            const oldIndex = blocks.findIndex((b) => b.id === active.id);
            const newIndex = blocks.findIndex((b) => b.id === over.id);
            const newBlocks = arrayMove(blocks, oldIndex, newIndex);
            setBlocks(newBlocks);

            try {

                const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
                if (sessionError || !sessionData.session) {
                    toast.error('Authentication failed. Please try again later.');
                    return;
                }

                const response = await fetch('/api/settings/block/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionData.session.access_token}`,
                    },
                    body: JSON.stringify({ blocks: newBlocks }),
                });

                if (response.ok) {
                    toast.success('Updated successfully.');
                } else {
                    toast.error('Failed to update blocks. Please try again.');
                }
            } catch (error) {
                console.error('Unexpected error updating blocks order:', error);
                toast.error('An error occurred. Please try again later.');
            }
        }
        setFadeOut(false);
    }

    const handleSave = async (id: string, changes: Partial<Block>) => {
        toast("Updating...");
        const updatedBlocks = blocks.map(b => b.id === id ? { ...b, ...changes } : b);

        try {
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !sessionData.session) {
                toast.error("An error has occurred. Please try again later.");
                console.error("Unexpected error getting Session:", sessionError);
                setIsLoading(false);
                return;
            }

            const response = await fetch('/api/settings/block/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionData.session.access_token}`,
                },
                body: JSON.stringify({ blocks: updatedBlocks }),
            });

            if (response.ok) {
                setBlocks(updatedBlocks);
                toast.success("Updated successfully.");
            } else {
                toast.error("An error has occurred. Please try again later.");
            }
        } catch (error) {
            console.error("Unexpected error updating block:", error);
            toast.error("An error has occurred. Please try again later.");
        }
    };

    const handleDelete = async (id: string) => {
        toast("Deleting...");
        const updatedBlocks = blocks.filter(b => b.id !== id);
    
        try {
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !sessionData.session) {
                toast.error("An error has occurred. Please try again later.");
                console.error("Unexpected error getting Session:", sessionError);
                setIsLoading(false);
                return;
            }
    
            const response = await fetch('/api/settings/block/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionData.session.access_token}`,
                },
                body: JSON.stringify({ blocks: updatedBlocks }),
            });
    
            if (response.ok) {
                setBlocks(updatedBlocks);
                toast.success("Deleted successfully.");
            } else {
                toast.error("An error has occurred. Please try again later.");
            }
        } catch (error) {
            console.error("Unexpected error deleting block:", error);
            toast.error("An error has occurred. Please try again later.");
        }
    };

    if (loading || isLoading) {
        return (
            <>
                <Skeleton className="h-25 w-full mb-2 rounded-none" />
                <Skeleton className="h-50 w-full mb-2 rounded-none" />
                <Skeleton className="h-25 w-full mb-2 rounded-none" />
            </>
        );
    }

    if (!blocks || blocks.length === 0) {
        return <div className="text-center text-neutral-400 py-12">No blocks found</div>;
    }

    return (
        <>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={() => setFadeOut(true)} onDragEnd={handleDragEnd}>
                <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                    {blocks.map((block) => {
                        const componentName = `${block.component ?? "Button"}Admin`;
                        const Comp = componentMap[componentName] ?? (() => null);
                        const getProps = propsMap[componentName];
                        return (
                            <SortableItem key={block.id} id={block.id}>
                                <Comp {...(getProps ? getProps(block, { handleSave, handleDelete }) : block)} />
                            </SortableItem>
                        );
                    })}
                </SortableContext>
            </DndContext>

            <div className={`border-t border-neutral-200 dark:border-neutral-900 pt-2 mt-2 transition-opacity duration-500 ease-in-out ${fadeOut ? "opacity-0" : "opacity-100"}`}>
                <BlockStore />
            </div>
        </>
    );
}