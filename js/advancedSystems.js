// Продвинутые игровые системы для максимального апгрейда

// Система частиц
class ParticleSystem {
    constructor() {
        this.particles = [];
    }
    
    createMuzzleFlash(x, y, angle) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle + (Math.random() - 0.5) * 0.5) * (Math.random() * 3 + 2),
                vy: Math.sin(angle + (Math.random() - 0.5) * 0.5) * (Math.random() * 3 + 2),
                life: 0,
                maxLife: 15,
                color: '#FFD700',
                size: Math.random() * 3 + 1,
                type: 'muzzle'
            });
        }
    }
    
    createExplosion(x, y, color = '#FF4500') {
        for (let i = 0; i < 15; i++) {
            const angle = (Math.PI * 2 / 15) * i;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * (Math.random() * 5 + 3),
                vy: Math.sin(angle) * (Math.random() * 5 + 3),
                life: 0,
                maxLife: 30,
                color: color,
                size: Math.random() * 4 + 2,
                type: 'explosion'
            });
        }
    }
    
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.95;
            p.vy *= 0.95;
            p.life++;
            
            if (p.life >= p.maxLife) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    render(ctx) {
        this.update();
        
        ctx.save();
        this.particles.forEach(p => {
            const alpha = 1 - (p.life / p.maxLife);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }
}

// Система пауэр-апов
class PowerUpSystem {
    constructor() {
        this.powerUps = [];
        this.playerEffects = {};
    }
    
    spawnPowerUp(x, y) {
        const types = ['speed', 'damage', 'health', 'shield', 'multishot', 'rapid_fire'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        this.powerUps.push({
            x: x,
            y: y,
            type: type,
            radius: 12,
            life: 0,
            maxLife: 600, // 10 секунд
            collected: false,
            color: this.getPowerUpColor(type)
        });
    }
    
    getPowerUpColor(type) {
        const colors = {
            speed: '#00FFFF',
            damage: '#FF0000',
            health: '#00FF00',
            shield: '#0080FF',
            multishot: '#FF00FF',
            rapid_fire: '#FFFF00'
        };
        return colors[type] || '#FFFFFF';
    }
    
    checkPickups(player) {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            if (powerUp.collected) continue;
            
            const distance = Math.sqrt(
                Math.pow(player.x - powerUp.x, 2) + 
                Math.pow(player.y - powerUp.y, 2)
            );
            
            if (distance < player.radius + powerUp.radius) {
                this.applyPowerUp(player, powerUp.type);
                this.powerUps.splice(i, 1);
            }
        }
    }
    
    applyPowerUp(player, type) {
        const duration = 10000; // 10 секунд
        
        switch(type) {
            case 'speed':
                this.playerEffects.speed = Date.now() + duration;
                player.speedMultiplier = 1.5;
                break;
            case 'damage':
                this.playerEffects.damage = Date.now() + duration;
                player.damageMultiplier = 2;
                break;
            case 'health':
                player.health = Math.min(player.health + 50, player.maxHealth);
                break;
            case 'shield':
                player.shield = player.maxShield;
                break;
            case 'multishot':
                this.playerEffects.multishot = Date.now() + duration;
                break;
            case 'rapid_fire':
                this.playerEffects.rapidFire = Date.now() + duration;
                break;
        }
        
        console.log(`Получен пауэр-ап: ${type}`);
    }
    
    update() {
        // Обновление времени действия эффектов
        const now = Date.now();
        Object.keys(this.playerEffects).forEach(effect => {
            if (this.playerEffects[effect] < now) {
                delete this.playerEffects[effect];
            }
        });
        
        // Обновление пауэр-апов
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            powerUp.life++;
            
            if (powerUp.life >= powerUp.maxLife) {
                this.powerUps.splice(i, 1);
            }
        }
    }
    
    render(ctx) {
        this.powerUps.forEach(powerUp => {
            ctx.save();
            
            const pulse = Math.sin(powerUp.life * 0.1) * 0.3 + 0.7;
            ctx.globalAlpha = pulse;
            ctx.shadowBlur = 15;
            ctx.shadowColor = powerUp.color;
            ctx.fillStyle = powerUp.color;
            
            ctx.beginPath();
            ctx.arc(powerUp.x, powerUp.y, powerUp.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Иконка типа
            ctx.fillStyle = '#000000';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(powerUp.type.charAt(0).toUpperCase(), powerUp.x, powerUp.y + 3);
            
            ctx.restore();
        });
    }
}

// Система боссов
class BossSystem {
    constructor() {
        this.bosses = [];
        this.bossSpawnTimer = 0;
    }
    
    checkSpawn(game) {
        this.bossSpawnTimer++;
        
        // Спавн босса каждые 30 секунд (1800 кадров при 60 FPS)
        if (this.bossSpawnTimer >= 1800 && this.bosses.length === 0) {
            this.spawnBoss(game);
            this.bossSpawnTimer = 0;
        }
    }
    
    spawnBoss(game) {
        const bossTypes = ['tank', 'speeder', 'sniper', 'summoner'];
        const type = bossTypes[Math.floor(Math.random() * bossTypes.length)];
        
        const boss = {
            x: Math.random() * game.canvas.width,
            y: 50,
            type: type,
            health: 500,
            maxHealth: 500,
            radius: 30,
            speed: 1,
            damage: 50,
            lastShot: 0,
            fireRate: 1000,
            color: '#8B0000',
            phase: 1,
            abilities: this.getBossAbilities(type)
        };
        
        this.bosses.push(boss);
        console.log(`Спавнился босс: ${type}`);
    }
    
    getBossAbilities(type) {
        const abilities = {
            tank: ['charge', 'ground_slam'],
            speeder: ['dash', 'afterimage'],
            sniper: ['laser_beam', 'homing_missiles'],
            summoner: ['spawn_minions', 'teleport']
        };
        return abilities[type] || [];
    }
    
    update(game) {
        this.bosses.forEach(boss => {
            this.updateBoss(boss, game);
        });
    }
    
    updateBoss(boss, game) {
        // Простое ИИ босса - движение к игроку
        const dx = game.player.x - boss.x;
        const dy = game.player.y - boss.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            boss.x += (dx / distance) * boss.speed;
            boss.y += (dy / distance) * boss.speed;
        }
        
        // Стрельба
        const now = Date.now();
        if (now - boss.lastShot > boss.fireRate) {
            this.bossFire(boss, game);
            boss.lastShot = now;
        }
    }
    
    bossFire(boss, game) {
        const angle = Math.atan2(game.player.y - boss.y, game.player.x - boss.x);
        
        // Создаем пули босса (можно расширить)
        const bullet = {
            x: boss.x,
            y: boss.y,
            vx: Math.cos(angle) * 5,
            vy: Math.sin(angle) * 5,
            radius: 6,
            damage: boss.damage,
            color: '#FF4500',
            isBossBullet: true
        };
        
        if (!game.bossBullets) game.bossBullets = [];
        game.bossBullets.push(bullet);
    }
    
    render(ctx) {
        this.bosses.forEach(boss => {
            ctx.save();
            
            // Тело босса
            ctx.fillStyle = boss.color;
            ctx.shadowBlur = 20;
            ctx.shadowColor = boss.color;
            ctx.beginPath();
            ctx.arc(boss.x, boss.y, boss.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Полоса здоровья
            const healthBarWidth = boss.radius * 2;
            const healthPercent = boss.health / boss.maxHealth;
            
            ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.fillRect(boss.x - healthBarWidth/2, boss.y - boss.radius - 15, healthBarWidth * healthPercent, 8);
            
            ctx.strokeStyle = '#FFFFFF';
            ctx.strokeRect(boss.x - healthBarWidth/2, boss.y - boss.radius - 15, healthBarWidth, 8);
            
            ctx.restore();
        });
    }
}

// Система волн
class WaveManager {
    constructor() {
        this.currentWave = 1;
        this.enemiesPerWave = 5;
        this.waveTimer = 0;
        this.betweenWaves = false;
    }
    
    update(game) {
        if (!game.enemies) return;
        
        if (game.enemies.length === 0 && !this.betweenWaves) {
            this.betweenWaves = true;
            this.waveTimer = 0;
        }
        
        if (this.betweenWaves) {
            this.waveTimer++;
            if (this.waveTimer >= 180) { // 3 секунды между волнами
                this.startNextWave(game);
            }
        }
    }
    
    startNextWave(game) {
        this.currentWave++;
        this.betweenWaves = false;
        this.waveTimer = 0;
        
        // Увеличиваем сложность
        const enemiesToSpawn = this.enemiesPerWave + Math.floor(this.currentWave / 2);
        
        console.log(`Начинается волна ${this.currentWave} с ${enemiesToSpawn} врагами!`);
        
        // Здесь нужно будет интегрироваться с системой спавна врагов основной игры
    }
}

// Система звуков (заглушка)
class SoundManager {
    playShot(weaponType) {
        // Здесь можно добавить реальные звуки
        console.log(`Звук выстрела: ${weaponType}`);
    }
    
    playEnemyDeath() {
        console.log('Звук смерти врага');
    }
}

// Система достижений
class AchievementSystem {
    constructor() {
        this.achievements = [];
        this.unlockedAchievements = new Set();
    }
    
    check(game) {
        // Проверка различных достижений
        if (game.score >= 1000 && !this.unlockedAchievements.has('score_1000')) {
            this.unlock('score_1000', 'Набрать 1000 очков');
        }
        
        if (window.gameUpgrades.waveManager.currentWave >= 10 && !this.unlockedAchievements.has('wave_10')) {
            this.unlock('wave_10', 'Дойти до 10 волны');
        }
    }
    
    unlock(id, description) {
        this.unlockedAchievements.add(id);
        this.achievements.push({
            id: id,
            description: description,
            time: Date.now()
        });
        console.log(`Достижение разблокировано: ${description}`);
    }
}

// Система магазина
class ShopSystem {
    constructor() {
        this.isOpen = false;
        this.items = [
            { name: 'Увеличение урона', cost: 100, effect: 'damage' },
            { name: 'Увеличение скорости', cost: 150, effect: 'speed' },
            { name: 'Больше здоровья', cost: 200, effect: 'health' }
        ];
    }
}

// Дерево навыков
class SkillTree {
    constructor() {
        this.unlockedSkills = new Set();
        this.skillPoints = 0;
    }
    
    getActiveUpgrades() {
        return {
            doubleDamage: this.unlockedSkills.has('double_damage'),
            piercing: this.unlockedSkills.has('piercing'),
            explosive: this.unlockedSkills.has('explosive'),
            criticalChance: this.unlockedSkills.has('critical_chance')
        };
    }
}
