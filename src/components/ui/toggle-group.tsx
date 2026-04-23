'use client'

import * as React from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const toggleGroupVariants = cva(
    'inline-flex items-center',
    {
        variants: {
            variant: {
                default: 'rounded-lg bg-muted p-1 gap-1',
                pill: 'rounded-full bg-secondary p-1.5 gap-0.5',
                outline: 'rounded-lg border p-1 gap-1',
            },
            size: {
                default: '',
                sm: 'p-1',
                lg: 'p-2',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

const toggleGroupItemVariants = cva(
    'inline-flex items-center justify-center gap-2 font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default: [
                    'rounded-md',
                    'data-[state=on]:bg-background data-[state=on]:shadow-sm',
                    'data-[state=off]:text-muted-foreground data-[state=off]:hover:text-foreground',
                ],
                pill: [
                    'rounded-full',
                    'data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:shadow-sm',
                    'data-[state=off]:text-muted-foreground data-[state=off]:hover:text-foreground',
                ],
                outline: [
                    'rounded-md',
                    'data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:shadow-sm',
                    'data-[state=off]:text-muted-foreground data-[state=off]:hover:text-foreground data-[state=off]:hover:bg-muted',
                ],
            },
            size: {
                default: 'px-3 py-1.5 text-sm',
                sm: 'px-2 py-1 text-xs',
                lg: 'px-5 py-3 text-base',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

type ToggleGroupContextValue = VariantProps<typeof toggleGroupVariants> & {
    itemVariant?: VariantProps<typeof toggleGroupItemVariants>['variant']
    itemSize?: VariantProps<typeof toggleGroupItemVariants>['size']
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
    variant: 'default',
    size: 'default',
})

type ToggleGroupSingleProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleGroupVariants> & {
        type: 'single'
        value?: string
        defaultValue?: string
        onValueChange?: (value: string) => void
    }

type ToggleGroupMultipleProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleGroupVariants> & {
        type: 'multiple'
        value?: string[]
        defaultValue?: string[]
        onValueChange?: (value: string[]) => void
    }

type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps

function ToggleGroup({
    className,
    variant,
    size,
    children,
    ...props
}: ToggleGroupProps) {
    return (
        <ToggleGroupContext.Provider value={{ variant, size, itemVariant: variant, itemSize: size }}>
            <ToggleGroupPrimitive.Root
                data-slot="toggle-group"
                className={cn(toggleGroupVariants({ variant, size, className }))}
                {...props}
            >
                {children}
            </ToggleGroupPrimitive.Root>
        </ToggleGroupContext.Provider>
    )
}

interface ToggleGroupItemProps
    extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
        VariantProps<typeof toggleGroupItemVariants> {}

function ToggleGroupItem({
    className,
    variant,
    size,
    children,
    ...props
}: ToggleGroupItemProps) {
    const context = React.useContext(ToggleGroupContext)
    const resolvedVariant = variant ?? context.itemVariant ?? 'default'
    const resolvedSize = size ?? context.itemSize ?? 'default'

    return (
        <ToggleGroupPrimitive.Item
            data-slot="toggle-group-item"
            className={cn(
                toggleGroupItemVariants({ variant: resolvedVariant, size: resolvedSize, className })
            )}
            {...props}
        >
            {children}
        </ToggleGroupPrimitive.Item>
    )
}

export {
    ToggleGroup,
    ToggleGroupItem,
    toggleGroupVariants,
    toggleGroupItemVariants,
}
