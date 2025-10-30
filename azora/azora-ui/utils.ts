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
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
