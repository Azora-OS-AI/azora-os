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
import { Loader2Icon } from 'lucide-react'

import { cn } from '@/lib/utils'

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  )
}

export { Spinner }
