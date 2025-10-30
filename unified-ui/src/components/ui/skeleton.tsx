/* 
AZORA PROPRIETARY LICENSE 
Copyright (c) 2025 Azora ES (Pty) Ltd. All Rights Reserved. 
<<<<<<< HEAD
ECHO is off.
See LICENSE file for details. 
*/ 
ECHO is off.
=======
See LICENSE file for details. 
*/ 
>>>>>>> clean-branch
import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  )
}

export { Skeleton }
