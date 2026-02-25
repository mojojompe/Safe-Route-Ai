declare module 'hugeicons-react' {
    import { FC, SVGProps } from 'react'

    export interface HugeiconsIconProps extends SVGProps<SVGSVGElement> {
        size?: number | string;
        color?: string;
        variant?: 'stroke' | 'solid' | 'bulk' | 'twotone';
    }

    export const Route02Icon: FC<HugeiconsIconProps>;
    export const SidebarLeftIcon: FC<HugeiconsIconProps>;
}
