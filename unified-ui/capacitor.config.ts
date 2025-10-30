/*
AZORA PROPRIETARY LICENSE
Copyright (c) 2025 Azora ES (Pty) Ltd. All Rights Reserved.
See LICENSE file for details.
*/

import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.azora.os',
  appName: 'Azora OS',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#1f2937',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff',
      splashFullScreen: true,
      splashImmersive: true
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF'
    },
    Geolocation: {
      permissions: {
        android: {
          coarseLocation: {
            rationaleMessage: 'Azora OS needs access to your location for GPS insights and safety features.'
          },
          fineLocation: {
            rationaleMessage: 'Azora OS needs precise location access for optimal navigation and emergency services.'
          }
        },
        ios: {
          location: {
            rationaleMessage: 'Azora OS uses your location for navigation, safety monitoring, and emergency services.'
          }
        }
      }
    },
    Camera: {
      permissions: {
        android: {
          camera: {
            rationaleMessage: 'Azora OS needs camera access for security features, AI assistance, and document scanning.'
          }
        },
        ios: {
          camera: {
            rationaleMessage: 'Azora OS uses the camera for security monitoring, AI assistance, and document processing.'
          }
        }
      }
    },
    Filesystem: {
      permissions: {
        android: {
          read: {
            rationaleMessage: 'Azora OS needs file access to manage your documents and system files.'
          },
          write: {
            rationaleMessage: 'Azora OS needs to save files and configurations.'
          }
        },
        ios: {
          read: {
            rationaleMessage: 'Azora OS needs access to your files for document management.'
          },
          write: {
            rationaleMessage: 'Azora OS needs to save files and settings.'
          }
        }
      }
    }
  },
  android: {
    buildOptions: {
      keystorePath: 'android.keystore',
      keystoreAlias: 'azora',
      keystorePassword: process.env.ANDROID_KEYSTORE_PASSWORD,
      keystoreAliasPassword: process.env.ANDROID_KEYSTORE_ALIAS_PASSWORD
    },
    signingType: 'apksigner'
  },
  ios: {
    scheme: 'Azora OS',
    buildOptions: {
      codeSignIdentity: 'iPhone Developer',
      developmentTeam: process.env.IOS_DEVELOPMENT_TEAM,
      packageType: 'app-store',
      provisioningProfile: process.env.IOS_PROVISIONING_PROFILE
    }
  }
}

export default config
