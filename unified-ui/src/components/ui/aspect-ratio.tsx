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
'use client'

import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio'

function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

export { AspectRatio }
