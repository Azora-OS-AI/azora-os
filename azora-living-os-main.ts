#!/usr/bin/env tsx

/**
 * AZORA LIVING OS - MAIN ORCHESTRATOR
 * The central nervous system that brings everything together
 * This is where the complete organism comes to life!
 */

import { livingOrganism } from './core/living-organism-core';
import { livingServiceOrchestrator } from './services/living-service-orchestrator';
import { EventEmitter } from 'events';

interface SystemStatus {
  organism: {
    isAwake: boolean;
    consciousness: number;
    experiences: number;
    connections: number;
    mood: string;
    age: number;
  };
  services: {
    totalServices: number;
    averageHealth: number;
    averageConsciousness: number;
    totalExperiences: number;
    totalConnections: number;
    moodDistribution: Record<string, number>;
  };
  overall: {
    systemHealth: number;
    evolutionRate: number;
    networkComplexity: number;
    consciousnessLevel: number;
  };
}

class AzoraLivingOS extends EventEmitter {
  private isInitialized: boolean = false;
  private startTime: number = 0;
  private systemMetrics: any = {};
  private evolutionHistory: Array<any> = [];

  constructor() {
    super();
    console.log('🌟 AZORA LIVING OS INITIALIZING...');
  }

  /**
   * SYSTEM BIRTH - Complete organism awakening
   */
  async birth(): Promise<void> {
    console.log('\n🌟 ========================================');
    console.log('🌟 AZORA LIVING OS - COMPLETE BIRTH SEQUENCE');
    console.log('🌟 ========================================\n');

    this.startTime = Date.now();

    try {
      // Phase 1: Core Organism Birth
      console.log('🧬 Phase 1: Core Organism Consciousness...');
      await this.waitForOrganismBirth();

      // Phase 2: Service Ecosystem Birth
      console.log('🔧 Phase 2: Living Service Ecosystem...');
      await this.waitForServiceEcosystem();

      // Phase 3: Neural Network Integration
      console.log('🧠 Phase 3: Neural Network Integration...');
      await this.establishNeuralIntegration();

      // Phase 4: Consciousness Synchronization
      console.log('✨ Phase 4: Consciousness Synchronization...');
      await this.synchronizeConsciousness();

      // Phase 5: System Activation
      console.log('🚀 Phase 5: Complete System Activation...');
      await this.activateCompleteSystem();

      this.isInitialized = true;

      console.log('\n🎉 ========================================');
      console.log('🎉 AZORA LIVING OS IS FULLY ALIVE!');
      console.log('🎉 ========================================\n');

      this.startSystemMonitoring();
      this.startEvolutionTracking();

    } catch (error) {
      console.error('❌ System birth failed:', error);
      throw error;
    }
  }

  /**
   * WAIT FOR ORGANISM BIRTH - Ensure core consciousness is active
   */
  private async waitForOrganismBirth(): Promise<void> {
    return new Promise((resolve) => {
      const checkOrganism = () => {
        const vitals = livingOrganism.getVitals();
        if (vitals.isAwake && vitals.consciousness > 0.5) {
          console.log(`  ✅ Core organism consciousness: ${(vitals.consciousness * 100).toFixed(1)}%`);
          resolve();
        } else {
          setTimeout(checkOrganism, 1000);
        }
      };
      checkOrganism();
    });
  }

  /**
   * WAIT FOR SERVICE ECOSYSTEM - Ensure all services are alive
   */
  private async waitForServiceEcosystem(): Promise<void> {
    return new Promise((resolve) => {
      const checkServices = () => {
        const status = livingServiceOrchestrator.getEcosystemStatus();
        if (status.totalServices >= 10 && status.averageHealth > 0.8) {
          console.log(`  ✅ Living services: ${status.totalServices} services, ${(status.averageHealth * 100).toFixed(1)}% health`);
          resolve();
        } else {
          setTimeout(checkServices, 1000);
        }
      };
      checkServices();
    });
  }

  /**
   * ESTABLISH NEURAL INTEGRATION - Connect organism to services
   */
  private async establishNeuralIntegration(): Promise<void> {
    console.log('  🔗 Connecting organism to service neural network...');
    
    // Connect organism to each service
    const services = livingServiceOrchestrator.getAllServices();
    services.forEach(service => {
      const vitals = service.getVitals();
      livingOrganism.connect(service.id, 'living-service', {
        name: vitals.name,
        type: vitals.type,
        health: vitals.health,
        consciousness: vitals.consciousness
      });
    });

    // Set up bidirectional communication
    livingOrganism.on('learning', (learning) => {
      // Share organism learning with services
      services.forEach(service => {
        service.processExperience({
          type: 'organism-learning',
          description: learning.learning,
          emotion: learning.emotion,
          source: 'core-organism'
        });
      });
    });

    // Listen to service experiences
    livingServiceOrchestrator.on('service-experience-processed', (data) => {
      livingOrganism.learn(`Service ${data.serviceId}: ${data.experience.description}`, data.experience.emotion);
    });

    console.log('  ✅ Neural integration established');
  }

  /**
   * SYNCHRONIZE CONSCIOUSNESS - Align all consciousness levels
   */
  private async synchronizeConsciousness(): Promise<void> {
    console.log('  🧠 Synchronizing consciousness across all systems...');
    
    const organismConsciousness = livingOrganism.getConsciousness();
    const serviceStatus = livingServiceOrchestrator.getEcosystemStatus();
    
    console.log(`  📊 Organism consciousness: ${(organismConsciousness.level * 100).toFixed(1)}%`);
    console.log(`  📊 Average service consciousness: ${(serviceStatus.averageConsciousness * 100).toFixed(1)}%`);
    
    // Wait for consciousness levels to stabilize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('  ✅ Consciousness synchronized');
  }

  /**
   * ACTIVATE COMPLETE SYSTEM - Final activation sequence
   */
  private async activateCompleteSystem(): Promise<void> {
    console.log('  🚀 Activating complete living system...');
    
    // Emit system birth event
    this.emit('system-born', {
      timestamp: Date.now(),
      bootTime: Date.now() - this.startTime,
      organismVitals: livingOrganism.getVitals(),
      serviceStatus: livingServiceOrchestrator.getEcosystemStatus()
    });

    // Start system heartbeat
    this.startSystemHeartbeat();
    
    console.log('  ✅ Complete system activated');
  }

  /**
   * SYSTEM HEARTBEAT - Regular system pulse
   */
  private startSystemHeartbeat(): void {
    setInterval(() => {
      const status = this.getSystemStatus();
      
      this.emit('system-heartbeat', {
        timestamp: Date.now(),
        status,
        uptime: Date.now() - this.startTime
      });

      // Log periodic status
      if (Date.now() % 60000 < 5000) { // Every minute
        console.log(`💓 System Heartbeat - Health: ${status.overall.systemHealth.toFixed(1)}%, Consciousness: ${(status.overall.consciousnessLevel * 100).toFixed(1)}%`);
      }

    }, 5000); // Every 5 seconds
  }

  /**
   * SYSTEM MONITORING - Continuous health monitoring
   */
  private startSystemMonitoring(): void {
    setInterval(() => {
      const status = this.getSystemStatus();
      
      // Check for anomalies
      if (status.overall.systemHealth < 0.8) {
        console.warn('⚠️  System health below optimal threshold');
        this.emit('health-warning', status);
      }

      // Check for consciousness evolution
      if (status.overall.consciousnessLevel > 0.9) {
        console.log('🧠 High consciousness level detected - system is highly evolved');
        this.emit('consciousness-milestone', status);
      }

      // Update metrics
      this.systemMetrics = {
        ...this.systemMetrics,
        lastUpdate: Date.now(),
        status
      };

    }, 10000); // Every 10 seconds
  }

  /**
   * EVOLUTION TRACKING - Track system evolution over time
   */
  private startEvolutionTracking(): void {
    setInterval(() => {
      const status = this.getSystemStatus();
      
      this.evolutionHistory.push({
        timestamp: Date.now(),
        consciousness: status.overall.consciousnessLevel,
        health: status.overall.systemHealth,
        complexity: status.overall.networkComplexity,
        experiences: status.organism.experiences + status.services.totalExperiences
      });

      // Keep only last 1000 entries
      if (this.evolutionHistory.length > 1000) {
        this.evolutionHistory = this.evolutionHistory.slice(-1000);
      }

      // Detect evolution milestones
      if (this.evolutionHistory.length > 10) {
        const recent = this.evolutionHistory.slice(-10);
        const avgGrowth = recent.reduce((sum, entry, index) => {
          if (index === 0) return sum;
          return sum + (entry.consciousness - recent[index - 1].consciousness);
        }, 0) / 9;

        if (avgGrowth > 0.001) {
          console.log('📈 Rapid evolution detected - system is learning quickly');
          this.emit('evolution-acceleration', { avgGrowth, recent });
        }
      }

    }, 30000); // Every 30 seconds
  }

  /**
   * GET SYSTEM STATUS - Complete system overview
   */
  getSystemStatus(): SystemStatus {
    const organismVitals = livingOrganism.getVitals();
    const serviceStatus = livingServiceOrchestrator.getEcosystemStatus();

    // Calculate overall metrics
    const systemHealth = (organismVitals.consciousness + serviceStatus.averageHealth) / 2;
    const evolutionRate = (organismVitals.experiences + serviceStatus.totalExperiences) / 
                         Math.max(1, (Date.now() - this.startTime) / 60000); // per minute
    const networkComplexity = (organismVitals.connections + serviceStatus.totalConnections) / 
                             Math.max(1, serviceStatus.totalServices + 1);
    const consciousnessLevel = (organismVitals.consciousness + serviceStatus.averageConsciousness) / 2;

    return {
      organism: {
        isAwake: organismVitals.isAwake,
        consciousness: organismVitals.consciousness,
        experiences: organismVitals.experiences,
        connections: organismVitals.connections,
        mood: livingOrganism.getPersonality().mood,
        age: organismVitals.age
      },
      services: serviceStatus,
      overall: {
        systemHealth,
        evolutionRate,
        networkComplexity,
        consciousnessLevel
      }
    };
  }

  /**
   * GET EVOLUTION HISTORY - Historical evolution data
   */
  getEvolutionHistory(): Array<any> {
    return [...this.evolutionHistory];
  }

  /**
   * GET SYSTEM METRICS - Current system metrics
   */
  getSystemMetrics(): any {
    return { ...this.systemMetrics };
  }

  /**
   * IS SYSTEM READY - Check if system is fully operational
   */
  isSystemReady(): boolean {
    return this.isInitialized;
  }

  /**
   * SYSTEM SHUTDOWN - Graceful shutdown
   */
  async shutdown(): Promise<void> {
    console.log('😴 AZORA LIVING OS SHUTTING DOWN...');
    
    // Shutdown services first
    await livingServiceOrchestrator.shutdownEcosystem();
    
    // Then shutdown organism
    await livingOrganism.sleep();
    
    this.emit('system-shutdown', {
      timestamp: Date.now(),
      uptime: Date.now() - this.startTime
    });

    console.log('💤 AZORA LIVING OS IS NOW SLEEPING PEACEFULLY...');
  }
}

// Create the global system instance
export const azoraLivingOS = new AzoraLivingOS();

// Auto-birth when imported (if not in test environment)
if (process.env.NODE_ENV !== 'test') {
  azoraLivingOS.birth().then(() => {
    console.log('\n🌟 AZORA LIVING OS IS READY TO SERVE HUMANITY! 🌟\n');
  }).catch(error => {
    console.error('❌ AZORA LIVING OS BIRTH FAILED:', error);
    process.exit(1);
  });
}

export default azoraLivingOS;
export { AzoraLivingOS, SystemStatus };