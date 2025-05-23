// Максимальный апгрейд игры - Интеграция всех систем

// Глобальные системы игры
window.gameUpgrades = {
    particleSystem: new ParticleSystem(),
    soundManager: new SoundManager(),
    achievementSystem: new AchievementSystem(),
    powerUpSystem: new PowerUpSystem(),
    bossSystem: new BossSystem(),
    waveManager: new WaveManager(),
    shopSystem: new ShopSystem(),
    skillTree: new SkillTree()
};

// Функция для интеграции в основной игровой цикл
function integrateWeaponSystem(gameInstance) {
    // Сохраняем оригинальные методы
    const originalUpdate = gameInstance.update;
    const originalRender = gameInstance.render;
    const originalHandleInput = gameInstance.handleInput;
    
    // МАКСИМАЛЬНЫЙ АПГРЕЙД - Полная переработка игрового цикла
    gameInstance.update = function() {
        originalUpdate.call(this);
        
        // Обновляем все новые системы
        Object.values(window.gameUpgrades).forEach(system => {
            if (system && system.update) {
                system.update(this);
            }
        });
        
        if (window.weaponManager) {
            window.weaponManager.update();
            
            // Система подбора предметов с эффектами
            if (this.player) {
                this.handleItemPickups();
                this.updatePlayerStats();
                this.checkBossSpawn();
            }
            
            // Улучшенная система дропа с редкостью
            if (this.enemies) {
                this.enemies.forEach(enemy => {
                    if (enemy.justDied) {
                        this.handleEnemyDeath(enemy);
                        enemy.justDied = false;
                    }
                });
            }
        }
        
        // Система волн врагов
        this.updateWaveSystem();
        
        // Система достижений
        this.checkAchievements();
    };
    
    // Переопределяем метод отрисовки
    gameInstance.render = function(ctx) {
        // Вызываем оригинальную отрисовку
        originalRender.call(this, ctx);
        
        // Отрисовка всех улучшенных систем
        this.renderParticles(ctx);
        this.renderPowerUps(ctx);
        this.renderBosses(ctx);
        
        if (window.weaponManager) {
            window.weaponManager.renderWeaponDrops(ctx);
            this.renderAdvancedHUD(ctx);
        }
        
        // Отрисовка интерфейса
        this.renderMiniMap(ctx);
        this.renderSkillTree(ctx);
        this.renderShop(ctx);
    };
    
    // Улучшенная система стрельбы с критами и эффектами
    gameInstance.shoot = function(x, y, targetX, targetY) {
        if (!window.weaponManager) return;
        
        const angle = Math.atan2(targetY - y, targetX - x);
        const bullets = window.weaponManager.shoot(x, y, angle);
        
        if (bullets && this.bullets) {
            bullets.forEach(bullet => {
                // Применяем улучшения игрока
                this.applyPlayerUpgrades(bullet);
                
                // Добавляем партиклы выстрела
                window.gameUpgrades.particleSystem.createMuzzleFlash(x, y, angle);
                
                this.bullets.push(bullet);
            });
            
            // Звук выстрела
            window.gameUpgrades.soundManager.playShot(window.weaponManager.currentWeapon);
        }
    };
    
    // Новые методы для максимального апгрейда
    gameInstance.handleItemPickups = function() {
        window.gameUpgrades.powerUpSystem.checkPickups(this.player);
    };
    
    gameInstance.updatePlayerStats = function() {
        // Регенерация здоровья, щиты, опыт
        if (this.player.health < this.player.maxHealth) {
            this.player.health += this.player.regeneration || 0.1;
        }
        
        // Обновление щитов
        if (this.player.shield < this.player.maxShield) {
            this.player.shield += this.player.shieldRegen || 0.2;
        }
    };
    
    gameInstance.handleEnemyDeath = function(enemy) {
        // Опыт за убийство
        this.player.experience += enemy.expReward || 10;
        
        // Дроп с учетом редкости
        const dropChance = Math.random();
        if (dropChance < 0.4) { // 40% шанс обычного дропа
            window.weaponManager.spawnWeaponDrop(enemy.x, enemy.y);
        } else if (dropChance < 0.6) { // 20% шанс пауэр-апа
            window.gameUpgrades.powerUpSystem.spawnPowerUp(enemy.x, enemy.y);
        } else if (dropChance < 0.7) { // 10% шанс редкого предмета
            this.spawnRareItem(enemy.x, enemy.y);
        }
        
        // Партиклы смерти
        window.gameUpgrades.particleSystem.createExplosion(enemy.x, enemy.y, enemy.color);
        
        // Звук смерти врага
        window.gameUpgrades.soundManager.playEnemyDeath();
    };
    
    gameInstance.checkBossSpawn = function() {
        window.gameUpgrades.bossSystem.checkSpawn(this);
    };
    
    gameInstance.updateWaveSystem = function() {
        window.gameUpgrades.waveManager.update(this);
    };
    
    gameInstance.checkAchievements = function() {
        window.gameUpgrades.achievementSystem.check(this);
    };
    
    gameInstance.renderAdvancedHUD = function(ctx) {
        window.weaponManager.renderHUD(ctx, ctx.canvas.width, ctx.canvas.height);
        this.renderPlayerStats(ctx);
        this.renderWaveInfo(ctx);
        this.renderAchievementPopups(ctx);
    };
    
    gameInstance.renderPlayerStats = function(ctx) {
        ctx.save();
        
        // Фон статистик
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(ctx.canvas.width - 200, 10, 190, 120);
        
        // Здоровье
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(ctx.canvas.width - 190, 20, 170 * (this.player.health / this.player.maxHealth), 15);
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeRect(ctx.canvas.width - 190, 20, 170, 15);
        
        // Щит
        ctx.fillStyle = '#00FFFF';
        ctx.fillRect(ctx.canvas.width - 190, 40, 170 * (this.player.shield / this.player.maxShield), 15);
        ctx.strokeRect(ctx.canvas.width - 190, 40, 170, 15);
        
        // Опыт
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(ctx.canvas.width - 190, 60, 170 * (this.player.experience % 100 / 100), 15);
        ctx.strokeRect(ctx.canvas.width - 190, 60, 170, 15);
        
        // Текст
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.fillText(`HP: ${Math.floor(this.player.health)}/${this.player.maxHealth}`, ctx.canvas.width - 185, 32);
        ctx.fillText(`Shield: ${Math.floor(this.player.shield)}/${this.player.maxShield}`, ctx.canvas.width - 185, 52);
        ctx.fillText(`XP: ${this.player.experience} (Lv.${Math.floor(this.player.experience / 100) + 1})`, ctx.canvas.width - 185, 72);
        ctx.fillText(`Score: ${this.score || 0}`, ctx.canvas.width - 185, 92);
        ctx.fillText(`Wave: ${window.gameUpgrades.waveManager.currentWave}`, ctx.canvas.width - 185, 112);
        
        ctx.restore();
    };
    
    gameInstance.renderParticles = function(ctx) {
        window.gameUpgrades.particleSystem.render(ctx);
    };
    
    gameInstance.renderPowerUps = function(ctx) {
        window.gameUpgrades.powerUpSystem.render(ctx);
    };
    
    gameInstance.renderBosses = function(ctx) {
        window.gameUpgrades.bossSystem.render(ctx);
    };
    
    gameInstance.renderMiniMap = function(ctx) {
        // Мини-карта в правом нижнем углу
        const mapSize = 100;
        const mapX = ctx.canvas.width - mapSize - 10;
        const mapY = ctx.canvas.height - mapSize - 10;
        
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(mapX, mapY, mapSize, mapSize);
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeRect(mapX, mapY, mapSize, mapSize);
        
        // Игрок на карте
        ctx.fillStyle = '#00FF00';
        const playerMapX = mapX + (this.player.x / ctx.canvas.width) * mapSize;
        const playerMapY = mapY + (this.player.y / ctx.canvas.height) * mapSize;
        ctx.fillRect(playerMapX - 2, playerMapY - 2, 4, 4);
        
        // Враги на карте
        if (this.enemies) {
            ctx.fillStyle = '#FF0000';
            this.enemies.forEach(enemy => {
                const enemyMapX = mapX + (enemy.x / ctx.canvas.width) * mapSize;
                const enemyMapY = mapY + (enemy.y / ctx.canvas.height) * mapSize;
                ctx.fillRect(enemyMapX - 1, enemyMapY - 1, 2, 2);
            });
        }
        
        ctx.restore();
    };
    
    gameInstance.applyPlayerUpgrades = function(bullet) {
        // Применяем улучшения из дерева навыков
        const upgrades = window.gameUpgrades.skillTree.getActiveUpgrades();
        
        if (upgrades.doubleDamage) bullet.damage *= 2;
        if (upgrades.piercing) bullet.penetration += 2;
        if (upgrades.explosive) bullet.explosionRadius += 10;
        if (upgrades.criticalChance && Math.random() < 0.2) {
            bullet.isCritical = true;
            bullet.damage *= 3;
        }
    };
    
    // Инициализация систем
    gameInstance.initUpgradeSystems = function() {
        // Установка начальных статов игрока
        this.player.maxHealth = this.player.maxHealth || 100;
        this.player.health = this.player.health || this.player.maxHealth;
        this.player.maxShield = this.player.maxShield || 50;
        this.player.shield = this.player.shield || 0;
        this.player.experience = this.player.experience || 0;
        this.player.regeneration = 0.05;
        this.player.shieldRegen = 0.1;
        
        // Инициализация счета
        this.score = this.score || 0;
        
        console.log('Все системы апгрейда инициализированы!');
    };
}

// Автоматическая интеграция с расширенной инициализацией
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.game) {
            integrateWeaponSystem(window.game);
            window.game.initUpgradeSystems();
            console.log('МАКСИМАЛЬНЫЙ АПГРЕЙД ИГРЫ ЗАВЕРШЕН!');
        }
    }, 1000);
});

// Функция для ручной интеграции
window.integrateWeapons = integrateWeaponSystem;
