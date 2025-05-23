class WeaponManager {
    constructor() {
        this.currentWeapon = 'pistol';
        this.weaponDrops = [];
        this.lastShotTime = 0;
        this.ammo = {};
        this.maxAmmo = {};
        this.isReloading = false;
        this.reloadStartTime = 0;
        
        // Инициализация боеприпасов
        this.initializeAmmo();
        
        // Привязка клавиш
        this.setupControls();
    }
    
    initializeAmmo() {
        const weapons = ['pistol', 'rifle', 'shotgun', 'sniper', 'plasma', 'laser', 'rocket'];
        weapons.forEach(weapon => {
            const stats = Bullet.getWeaponStats(weapon);
            this.maxAmmo[weapon] = stats.ammo;
            this.ammo[weapon] = stats.ammo;
        });
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'q':
                    this.switchWeapon();
                    break;
                case 'r':
                    this.startReload();
                    break;
                case '1':
                    this.selectWeapon('pistol');
                    break;
                case '2':
                    this.selectWeapon('rifle');
                    break;
                case '3':
                    this.selectWeapon('shotgun');
                    break;
                case '4':
                    this.selectWeapon('sniper');
                    break;
                case '5':
                    this.selectWeapon('plasma');
                    break;
                case '6':
                    this.selectWeapon('laser');
                    break;
                case '7':
                    this.selectWeapon('rocket');
                    break;
            }
        });
    }
    
    switchWeapon() {
        const weapons = ['pistol', 'rifle', 'shotgun', 'sniper', 'plasma', 'laser', 'rocket'];
        const currentIndex = weapons.indexOf(this.currentWeapon);
        const nextIndex = (currentIndex + 1) % weapons.length;
        this.currentWeapon = weapons[nextIndex];
        console.log(`Переключено на: ${Bullet.getWeaponStats(this.currentWeapon).name}`);
    }
    
    selectWeapon(weaponType) {
        if (this.ammo[weaponType] !== undefined) {
            this.currentWeapon = weaponType;
            console.log(`Выбрано: ${Bullet.getWeaponStats(weaponType).name}`);
        }
    }
    
    canShoot() {
        if (this.isReloading) return false;
        if (this.ammo[this.currentWeapon] <= 0) return false;
        
        const stats = Bullet.getWeaponStats(this.currentWeapon);
        const now = Date.now();
        return (now - this.lastShotTime) >= stats.fireRate;
    }
    
    shoot(x, y, angle) {
        if (!this.canShoot()) return null;
        
        this.ammo[this.currentWeapon]--;
        this.lastShotTime = Date.now();
        
        const stats = Bullet.getWeaponStats(this.currentWeapon);
        
        if (this.currentWeapon === 'shotgun') {
            return Bullet.createShotgunBullets(x, y, angle, stats.speed, this.currentWeapon);
        } else {
            return [Bullet.createBullet(x, y, angle, stats.speed, this.currentWeapon)];
        }
    }
    
    startReload() {
        if (this.isReloading) return;
        if (this.ammo[this.currentWeapon] >= this.maxAmmo[this.currentWeapon]) return;
        
        this.isReloading = true;
        this.reloadStartTime = Date.now();
        console.log(`Перезарядка ${Bullet.getWeaponStats(this.currentWeapon).name}...`);
    }
    
    update() {
        // Обновление перезарядки
        if (this.isReloading) {
            const stats = Bullet.getWeaponStats(this.currentWeapon);
            const elapsed = Date.now() - this.reloadStartTime;
            
            if (elapsed >= stats.reloadTime) {
                this.ammo[this.currentWeapon] = this.maxAmmo[this.currentWeapon];
                this.isReloading = false;
                console.log(`${stats.name} перезаряжен!`);
            }
        }
        
        // Обновление анимации дропов
        this.weaponDrops.forEach(drop => {
            if (!drop.collected) {
                drop.bobOffset += 0.1;
                drop.glowIntensity = Math.sin(Date.now() * 0.005) * 0.5 + 0.5;
            }
        });
    }
    
    spawnWeaponDrop(x, y, weaponType = null) {
        const drop = Bullet.createWeaponDrop(x, y, weaponType);
        this.weaponDrops.push(drop);
        return drop;
    }
    
    checkWeaponPickup(playerX, playerY, playerRadius = 15) {
        for (let i = this.weaponDrops.length - 1; i >= 0; i--) {
            const drop = this.weaponDrops[i];
            if (drop.collected) continue;
            
            const distance = Math.sqrt(
                Math.pow(playerX - drop.x, 2) + 
                Math.pow(playerY - drop.y, 2)
            );
            
            if (distance < playerRadius + drop.radius) {
                this.selectWeapon(drop.weaponType);
                this.ammo[drop.weaponType] = this.maxAmmo[drop.weaponType];
                drop.collected = true;
                console.log(`Подобрано: ${Bullet.getWeaponStats(drop.weaponType).name}`);
                this.weaponDrops.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    
    renderWeaponDrops(ctx) {
        this.weaponDrops.forEach(drop => {
            if (drop.collected) return;
            
            ctx.save();
            
            // Анимация плавания
            const bobY = drop.y + Math.sin(drop.bobOffset) * 3;
            
            // Свечение
            const glowIntensity = drop.glowIntensity * 20 + 10;
            ctx.shadowBlur = glowIntensity;
            ctx.shadowColor = drop.color;
            
            // Основная форма дропа
            ctx.fillStyle = drop.color;
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.arc(drop.x, bobY, drop.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Иконка оружия в центре
            ctx.fillStyle = '#000000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.getWeaponIcon(drop.weaponType), drop.x, bobY + 4);
            
            ctx.restore();
        });
    }
    
    getWeaponIcon(weaponType) {
        const icons = {
            pistol: '🔫',
            rifle: '🏹',
            shotgun: '💥',
            sniper: '🎯',
            plasma: '⚡',
            laser: '🔺',
            rocket: '🚀'
        };
        return icons[weaponType] || '?';
    }
    
    renderHUD(ctx, canvasWidth, canvasHeight) {
        ctx.save();
        
        // Фон HUD
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, canvasHeight - 80, 300, 70);
        
        // Информация о текущем оружии
        const stats = Bullet.getWeaponStats(this.currentWeapon);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial';
        ctx.fillText(`${stats.name}`, 20, canvasHeight - 55);
        
        // Боеприпасы
        ctx.fillStyle = this.ammo[this.currentWeapon] > 0 ? '#00FF00' : '#FF0000';
        ctx.fillText(`Патроны: ${this.ammo[this.currentWeapon]}/${this.maxAmmo[this.currentWeapon]}`, 20, canvasHeight - 35);
        
        // Статус перезарядки
        if (this.isReloading) {
            const progress = (Date.now() - this.reloadStartTime) / stats.reloadTime;
            ctx.fillStyle = '#FFFF00';
            ctx.fillText(`Перезарядка: ${Math.floor(progress * 100)}%`, 20, canvasHeight - 15);
        }
        
        // Характеристики оружия
        ctx.font = '12px Arial';
        ctx.fillStyle = '#CCCCCC';
        ctx.fillText(`Урон: ${stats.damage} | Скорость: ${stats.fireRate}мс`, 180, canvasHeight - 45);
        ctx.fillText(stats.description, 180, canvasHeight - 25);
        
        ctx.restore();
    }
    
    getCurrentWeaponStats() {
        return Bullet.getWeaponStats(this.currentWeapon);
    }
}

// Глобальный экземпляр менеджера оружия
window.weaponManager = new WeaponManager();
