import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useEffect, useRef, useState } from "react"

export type Option = {
    id: number
    label: string
    value?: string | number
}

interface MultiSelectProps {
    options: Option[]
    selected: Option[]
    onChange: (options: Option[]) => void
    className?: string
    placeholder?: string
}

export function MultiSelect({
    options,
    selected,
    onChange,
    className,
    placeholder = "Sélectionner...",
}: MultiSelectProps) {
    const [open, setOpen] = useState(false)

    const handleUnselect = (option: Option) => {
        onChange(selected.filter((item) => item.id !== option.id))
    }

    const MultiSelectWidthRef = useRef<HTMLButtonElement>(null)

    const [width, setWidth] = useState(0)

    useEffect(() => {
        if (MultiSelectWidthRef.current) {
            setWidth(MultiSelectWidthRef.current.offsetWidth)
        }
    }, [MultiSelectWidthRef.current])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={MultiSelectWidthRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full justify-between p-3 ${selected.length > 1 ? "h-full" : "h-[50px]"}`}
                    onClick={() => setOpen(!open)}
                >
                    <div className="flex flex-wrap gap-1">
                        {selected.length > 0 ? (
                            selected.map((option) => (
                                <Badge
                                    key={option.id}
                                    variant="grey"
                                    className="mr-1 mb-1"
                                >
                                    {option.label}
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        className="ml-1 cursor-pointer ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleUnselect(option)
                                            }
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleUnselect(option)
                                        }}
                                    >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </span>
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" style={{ width: width }}>
                <Command className={className}>
                    <CommandInput placeholder="Rechercher..." />
                    <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                        {options.map((option) => (
                            <CommandItem
                                key={option.id}
                                onSelect={() => {
                                    const isSelected = selected.some((item) => item.id === option.id)
                                    if (isSelected) {
                                        onChange(selected.filter((item) => item.id !== option.id))
                                    } else {
                                        onChange([...selected, option])
                                    }
                                    setOpen(true)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        selected.some((item) => item.id === option.id)
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
