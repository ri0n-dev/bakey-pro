import { Button, ButtonAdmin } from "@/components/blocks/Button";

type Block = {
    id: string
    content: any[]
    component?: string
    lock: string
    redirect?: string
    title?: string
    icon?: string
}

type Handlers = {
    handleSave: (id: string, changes: Partial<Block>) => void | Promise<void>;
    handleDelete: (id: string) => void;
};

export const componentMap: Record<string, React.ElementType> = {
    Button,
    ButtonAdmin,
};

export const propsMap: Record<string, (block: Block, handlers: Handlers) => any> = {
    Button: (block) => ({
        title: block.content[0]?.title,
        redirect: block.redirect,
        icon: block.content[0]?.icon,
    }),
    ButtonAdmin: (block, { handleSave, handleDelete }) => ({
        id: block.id,
        content: block.content,
        redirect: block.redirect,
        handleSave: (id: string, changes: Partial<Block>) => handleSave(id, changes),
        handleDelete: (id: string) => handleDelete(id),
    }),
};