class Bullet {
    constructor(x, y, vx, vy, weaponType = 'pistol') {
        this.x = parseFloat(x) || 0;
        this.y = parseFloat(y) || 0;
        this.vx = parseFloat(vx) || 0;
        this.vy = parseFloat(vy) || 0;
        this.weaponType = weaponType;
        this.hitType = null;
        
        // Настройки в зависимости от типа оружия
        this.setWeaponProperties(this.weaponType);
        
        // Оптимизированные характеристики
        this.initOptimizedProperties();
    }
    
    initOptimizedProperties() {
        // Минимальный набор свойств для избежания зависания
        this.baseDamage = this.damage;
        this.armorPenetration = 0;
        this.pierceCount = 0;
        this.maxPierces = this.penetration || 0;
        
        // Простые флаги вместо объектов
        this.hasElementalDamage = false;
        this.isHoming = false;
        this.canRicochet = false;
        this.ricochetCount = 0;
        this.bounceCount = 0; // Для гранат
    }

    setWeaponProperties(weaponType) {
        switch(weaponType) {
            case 'pistol':
                this.radius = 4;
                this.damage = 25;
                this.maxLife = 100;
                this.color = '#FFFF00';
                this.innerColor = '#FFD700';
                this.speed = 8;
                this.fireRate = 300;
                this.shape = 'circle';
                this.penetration = 1;
                this.explosionRadius = 0;
                this.setupPistolOptimized();
                break;
            case 'rifle':
                this.radius = 6;
                this.damage = 40;
                this.maxLife = 150;
                this.color = '#FF6600';
                this.innerColor = '#FF8C00';
                this.speed = 12;
                this.fireRate = 150;
                this.shape = 'square';
                this.penetration = 2;
                this.explosionRadius = 0;
                this.setupRifleOptimized();
                break;
            case 'shotgun':
                this.radius = 8;
                this.damage = 60;
                this.maxLife = 80;
                this.color = '#FF0000';
                this.innerColor = '#FF4500';
                this.speed = 6;
                this.fireRate = 800;
                this.shape = 'star';
                this.penetration = 1;
                this.explosionRadius = 20;
                this.setupShotgunOptimized();
                break;
            case 'sniper':
                this.radius = 3;
                this.damage = 120;
                this.maxLife = 200;
                this.color = '#00FFFF';
                this.innerColor = '#87CEEB';
                this.speed = 15;
                this.fireRate = 1500;
                this.shape = 'line';
                this.penetration = 5;
                this.explosionRadius = 0;
                this.setupSniperOptimized();
                break;
            case 'plasma':
                this.radius = 10;
                this.damage = 80;
                this.maxLife = 120;
                this.color = '#00FF00';
                this.innerColor = '#90EE90';
                this.speed = 10;
                this.fireRate = 400;
                this.shape = 'plasma';
                this.penetration = 3;
                this.explosionRadius = 30;
                this.isPlasma = true;
                this.setupPlasmaOptimized();
                break;
            case 'laser':
                this.radius = 1;
                this.damage = 15;
                this.maxLife = 300;
                this.color = '#FF00FF';
                this.innerColor = '#FFB6C1';
                this.speed = 20;
                this.fireRate = 50;
                this.shape = 'beam';
                this.penetration = 10;
                this.explosionRadius = 0;
                this.isLaser = true;
                this.setupLaserOptimized();
                break;
            case 'rocket':
                this.radius = 8;
                this.damage = 150;
                this.maxLife = 120;
                this.color = '#FF4500';
                this.innerColor = '#FF6347';
                this.speed = 7;
                this.fireRate = 2000;
                this.shape = 'rocket';
                this.penetration = 1;
                this.explosionRadius = 50;
                this.isRocket = true;
                this.setupRocketOptimized();
                break;
            case 'grenade':
                this.radius = 6;
                this.damage = 200;
                this.maxLife = 90;
                this.color = '#8B4513';
                this.innerColor = '#A0522D';
                this.speed = 4;
                this.fireRate = 3000;
                this.shape = 'grenade';
                this.penetration = 0;
                this.explosionRadius = 80;
                this.isGrenade = true;
                this.gravity = 0.15;
                this.setupGrenadeOptimized();
                break;
            case 'melee':
                this.radius = 15;
                this.damage = 300;
                this.maxLife = 30;
                this.color = '#C0C0C0';
                this.innerColor = '#FFFFFF';
                this.speed = 2;
                this.fireRate = 1000;
                this.shape = 'melee';
                this.penetration = 1;
                this.explosionRadius = 0;
                this.isMelee = true;
                this.setupMeleeOptimized();
                break;
            default:
                this.radius = 4;
                this.damage = 25;
                this.maxLife = 120;
                this.color = '#FFFF00';
                this.innerColor = '#FFD700';
                this.speed = 8;
                this.fireRate = 500;
                this.shape = 'circle';
        }
        
        this.life = 0;
        this.isCritical = Math.random() < (this.criticalChance || 0.15);
        this.hitTargets = []; // Ограничиваем размер массива
    }
    
    // УЛУЧШЕННЫЕ НАСТРОЙКИ ОРУЖИЯ
    setupPistolOptimized() {
        this.criticalChance = 0.12;
        this.criticalMultiplier = 2.2;
        this.armorPenetration = 15;
        this.canRicochet = true;
        this.ricochetChance = 0.08;
        this.maxRicochets = 1;
        this.accuracy = 0.95;
        this.weaponClass = 'pistol';
    }
    
    setupRifleOptimized() {
        this.criticalChance = 0.18;
        this.criticalMultiplier = 2.8;
        this.armorPenetration = 35;
        this.maxPierces = 3;
        this.canRicochet = true;
        this.ricochetChance = 0.06;
        this.maxRicochets = 2;
        this.accuracy = 0.88;
        this.weaponClass = 'automatic';
        this.hasTracer = true;
    }
    
    setupShotgunOptimized() {
        this.criticalChance = 0.06;
        this.criticalMultiplier = 1.6;
        this.armorPenetration = 8;
        this.knockbackForce = 35;
        this.spread = 0.4;
        this.damageDropoff = 0.6;
        this.accuracy = 0.65;
        this.weaponClass = 'shotgun';
        this.pelletCount = 8;
    }
    
    setupSniperOptimized() {
        this.criticalChance = 0.45;
        this.criticalMultiplier = 5.0;
        this.armorPenetration = 100;
        this.maxPierces = 8;
        this.canPierceWalls = true;
        this.maxRicochets = 0;
        this.accuracy = 0.99;
        this.weaponClass = 'sniper';
        this.hasScope = true;
        this.windEffect = 0.05;
    }
    
    setupPlasmaOptimized() {
        this.criticalChance = 0.25;
        this.criticalMultiplier = 3.5;
        this.hasElementalDamage = true;
        this.elementalDamageValue = 25;
        this.canPierceWalls = true;
        this.maxPierces = 4;
        this.accuracy = 0.82;
        this.weaponClass = 'energy';
        this.energyDecay = 0.97;
        this.chainLightning = true;
    }
    
    setupLaserOptimized() {
        this.criticalChance = 0.22;
        this.criticalMultiplier = 2.0;
        this.armorPenetration = 50;
        this.maxPierces = 15;
        this.canPierceWalls = true;
        this.accuracy = 1.0;
        this.weaponClass = 'energy';
        this.isInstantHit = true;
        this.overheat = false;
    }
    
    setupRocketOptimized() {
        this.criticalChance = 0.15;
        this.criticalMultiplier = 2.5;
        this.armorPenetration = 200;
        this.knockbackForce = 100;
        this.accuracy = 0.75;
        this.weaponClass = 'explosive';
        this.homingCapability = true;
        this.splashDamage = true;
        this.gravity = 0.05;
    }
    
    setupGrenadeOptimized() {
        this.criticalChance = 0.0;
        this.criticalMultiplier = 1.0;
        this.armorPenetration = 50;
        this.knockbackForce = 150;
        this.accuracy = 0.8;
        this.weaponClass = 'explosive';
        this.cookingTime = 3000;
        this.bounceCount = 2;
        this.maxBounces = 3;
    }
    
    setupMeleeOptimized() {
        this.criticalChance = 0.30;
        this.criticalMultiplier = 4.0;
        this.armorPenetration = 25;
        this.knockbackForce = 50;
        this.accuracy = 1.0;
        this.weaponClass = 'melee';
        this.cleave = true;
        this.executionThreshold = 0.2;
    }
    
    update(obstacles, enemies, specialItems) {
        // Применяем физику в зависимости от типа оружия
        this.applyWeaponPhysics();
        
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        
        // Специальная логика для гранат
        if (this.isGrenade) {
            return this.updateGrenade(obstacles, enemies);
        }
        
        // Проверка времени жизни
        if (this.life > this.maxLife) {
            this.hitType = 'timeout';
            return true;
        }
        
        // Проверка столкновений с препятствиями
        if (obstacles && obstacles.length > 0) {
            for (let obstacle of obstacles) {
                if (obstacle && this.checkObstacleCollision(obstacle)) {
                    return this.handleObstacleHit(obstacle);
                }
            }
        }
        
        // Проверка столкновений с врагами
        if (enemies && enemies.length > 0) {
            const maxEnemyChecks = Math.min(enemies.length, 50);
            
            for (let i = 0; i < maxEnemyChecks; i++) {
                const enemy = enemies[i];
                if (enemy && !enemy.isDead && this.checkEnemyCollision(enemy)) {
                    const shouldDestroy = this.handleEnemyHit(enemy);
                    if (shouldDestroy) return true;
                }
            }
        }
        
        // Проверка границ
        if (this.x < -50 || this.x > 850 || this.y < -50 || this.y > 650) {
            this.hitType = 'boundary';
            return true;
        }
        
        return false;
    }
    
    applyWeaponPhysics() {
        // Гравитация для гранат и ракет
        if (this.gravity > 0) {
            this.vy += this.gravity;
        }
        
        // Энергетический распад для плазмы
        if (this.energyDecay && this.energyDecay < 1) {
            this.damage *= this.energyDecay;
            this.radius *= this.energyDecay;
        }
        
        // Эффект ветра для снайперских пуль
        if (this.windEffect > 0) {
            this.vx += (Math.random() - 0.5) * this.windEffect;
        }
    }
    
    checkObstacleCollision(obstacle) {
        return (this.x + this.radius > obstacle.x && 
                this.x - this.radius < obstacle.x + (obstacle.width || 40) &&
                this.y + this.radius > obstacle.y && 
                this.y - this.radius < obstacle.y + (obstacle.height || 40));
    }
    
    checkEnemyCollision(enemy) {
        const dx = this.x - enemy.x;
        const dy = this.y - enemy.y;
        const distance = dx * dx + dy * dy;
        const collisionDistance = (this.radius + (enemy.radius || 15)) ** 2;
        return distance < collisionDistance;
    }
    
    handleObstacleHit(obstacle) {
        // Пробитие стен
        if (this.canPierceWalls && this.pierceCount < this.maxPierces) {
            this.pierceCount++;
            this.damage *= 0.75;
            return false;
        }
        
        // Рикошет
        if (this.canRicochet && this.ricochetCount < (this.maxRicochets || 0)) {
            return this.handleRicochet(obstacle);
        }
        
        // Взрыв для взрывчатки
        if (this.weaponClass === 'explosive') {
            this.explode();
        }
        
        this.hitType = 'obstacle';
        return true;
    }
    
    handleEnemyHit(enemy) {
        // Ограничиваем размер массива попаданий
        if (this.hitTargets.length > 10) {
            this.hitTargets.shift();
        }
        this.hitTargets.push(enemy);
        
        // Рассчитываем урон
        let finalDamage = this.calculateDamage(enemy);
        
        // Применяем урон
        enemy.health -= finalDamage;
        
        // Эффекты попадания
        this.applyHitEffects(enemy);
        
        // Пробивание врагов
        if (this.pierceCount < this.maxPierces) {
            this.pierceCount++;
            this.damage *= 0.85;
            return false;
        }
        
        // Взрыв при попадании
        if (this.weaponClass === 'explosive') {
            this.explode();
        }
        
        this.hitType = 'enemy';
        this.hitTarget = enemy;
        return true;
    }
    
    updateGrenade(obstacles, enemies) {
        // Отскок гранаты
        if (this.bounceCount < this.maxBounces) {
            // Проверка столкновения с землей или препятствиями
            if (this.y > 580 || (obstacles && this.checkAnyObstacleCollision(obstacles))) {
                this.vy = -this.vy * 0.6; // Отскок с потерей энергии
                this.vx *= 0.8; // Трение
                this.bounceCount++;
            }
        }
        
        // Взрыв по таймеру
        if (this.life > this.cookingTime / 16.67) { // 60 FPS
            this.explode();
            return true;
        }
        
        return false;
    }
    
    explode() {
        // Создаем взрыв
        if (window.game && window.game.createExplosion) {
            window.game.createExplosion(this.x, this.y, this.explosionRadius, this.damage);
        }
        
        console.log(`💥 Взрыв! Радиус: ${this.explosionRadius}, Урон: ${this.damage}`);
    }
    
    calculateDamage(enemy) {
        let damage = this.baseDamage;
        
        // Критический урон
        if (this.isCritical) {
            damage *= this.criticalMultiplier || 2;
        }
        
        // Пробитие брони
        if (this.armorPenetration > 0 && enemy.armor) {
            const effectiveArmor = Math.max(0, enemy.armor - this.armorPenetration);
            const armorReduction = effectiveArmor / (effectiveArmor + 100);
            damage *= (1 - armorReduction);
        }
        
        // Урон от расстояния (для дробовика)
        if (this.damageDropoff) {
            const distance = Math.sqrt(
                Math.pow(this.x - enemy.x, 2) + 
                Math.pow(this.y - enemy.y, 2)
            );
            const dropoffFactor = Math.max(this.damageDropoff, 1 - (distance / 200));
            damage *= dropoffFactor;
        }
        
        // Элементальный урон
        if (this.hasElementalDamage) {
            damage += this.elementalDamageValue || 0;
        }
        
        // Казнь для ближнего боя
        if (this.executionThreshold && enemy.health / enemy.maxHealth < this.executionThreshold) {
            damage *= 10; // Мгновенная смерть
        }
        
        return Math.floor(damage);
    }
    
    applyHitEffects(enemy) {
        // Отбрасывание
        if (this.knockbackForce > 0) {
            this.applyKnockback(enemy);
        }
        
        // Элементальные эффекты
        if (this.hasElementalDamage) {
            this.applyElementalEffects(enemy);
        }
        
        // Цепная молния для плазмы
        if (this.chainLightning && Math.random() < 0.3) {
            this.createChainLightning(enemy);
        }
    }
    
    applyKnockback(enemy) {
        const angle = Math.atan2(enemy.y - this.y, enemy.x - this.x);
        const knockbackX = Math.cos(angle) * this.knockbackForce;
        const knockbackY = Math.sin(angle) * this.knockbackForce;
        
        enemy.x += knockbackX * 0.5;
        enemy.y += knockbackY * 0.5;
        
        if (enemy.vx !== undefined) {
            enemy.vx += knockbackX * 0.1;
            enemy.vy += knockbackY * 0.1;
        }
    }
    
    handleRicochet(surface) {
        if (this.ricochetCount >= (this.maxRicochets || 0)) {
            return true;
        }
        
        if (Math.random() < (this.ricochetChance || 0)) {
            // Улучшенный рикошет
            const normalX = 0; // Упрощенная нормаль
            const normalY = -1;
            
            // Отражение вектора скорости
            const dot = this.vx * normalX + this.vy * normalY;
            this.vx = this.vx - 2 * dot * normalX;
            this.vy = this.vy - 2 * dot * normalY;
            
            // Потеря энергии
            this.vx *= 0.75;
            this.vy *= 0.75;
            
            this.ricochetCount++;
            this.damage *= 0.8;
            
            // Сдвигаем пулю от поверхности
            this.x += this.vx * 3;
            this.y += this.vy * 3;
            
            console.log('🔄 Рикошет!');
            return false;
        }
        
        return true;
    }
    
    render(ctx) {
        if (!ctx) return;
        
        ctx.save();
        
        const bulletColor = this.isCritical ? '#FF0000' : this.color;
        
        // Улучшенная отрисовка с эффектами оружия
        ctx.shadowBlur = this.radius * (this.weaponClass === 'energy' ? 4 : 2);
        ctx.shadowColor = bulletColor;
        ctx.fillStyle = bulletColor;
        
        // Специальные формы для разных классов оружия
        this.renderByWeaponClass(ctx, bulletColor);
        
        // Эффекты для специальных типов
        if (this.hasTracer && this.weaponClass === 'automatic') {
            this.renderTracer(ctx, bulletColor);
        }
        
        if (this.weaponClass === 'energy') {
            this.renderEnergyEffects(ctx, bulletColor);
        }
        
        ctx.restore();
    }
    
    renderByWeaponClass(ctx, bulletColor) {
        // Определяем размер экрана и устройство
        const isMobile = this.detectMobileDevice();
        const scaleFactor = isMobile ? this.getMobileScaleFactor() : 1;
        const effectsLevel = isMobile ? 'mobile' : 'desktop';
        
        // АДАПТИВНАЯ ВИЗУАЛИЗАЦИЯ для каждого типа
        switch(this.shape) {
            case 'circle': // ПИСТОЛЕТ
                this.renderPistol(ctx, bulletColor, scaleFactor, effectsLevel);
                break;
                
            case 'square': // ВИНТОВКА
                this.renderRifle(ctx, bulletColor, scaleFactor, effectsLevel);
                break;
                
            case 'star': // ДРОБОВИК
                this.renderShotgun(ctx, bulletColor, scaleFactor, effectsLevel);
                break;
                
            case 'line': // СНАЙПЕРКА
                this.renderSniper(ctx, bulletColor, scaleFactor, effectsLevel);
                break;
                
            case 'plasma': // ПЛАЗМА
                this.renderPlasma(ctx, bulletColor, scaleFactor, effectsLevel);
                break;
                
            case 'beam': // ЛАЗЕР
                this.renderLaser(ctx, bulletColor, scaleFactor, effectsLevel);
                break;
                
            case 'rocket': // РАКЕТА
                this.renderRocket(ctx, bulletColor, scaleFactor, effectsLevel);
                break;
                
            case 'grenade': // ГРАНАТА
                this.renderGrenade(ctx, bulletColor, scaleFactor, effectsLevel);
                break;
                
            case 'melee': // БЛИЖНИЙ БОЙ
                this.renderMelee(ctx, bulletColor, scaleFactor, effectsLevel);
                break;
                
            default:
                this.renderDefault(ctx, bulletColor, scaleFactor, effectsLevel);
        }
        
        // Адаптивный индикатор типа оружия
        if (this.weaponClass && !isMobile) { // Скрываем текст на мобильных
            ctx.font = `${8 * scaleFactor}px Arial`;
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.fillText(
                this.weaponClass.substring(0, 3).toUpperCase(), 
                this.x, 
                this.y + this.radius * scaleFactor + 12
            );
        }
    }
    
    // РЕНДЕР ПИСТОЛЕТА
    renderPistol(ctx, bulletColor, scale, effectsLevel) {
        const radius = this.radius * scale;
        const shadowBlur = effectsLevel === 'mobile' ? 10 : 20;
        
        ctx.shadowBlur = shadowBlur;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Белая обводка (упрощенная на мобильных)
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = effectsLevel === 'mobile' ? 2 : 3;
        ctx.stroke();
        
        // Центральная точка
        if (effectsLevel === 'desktop') {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // РЕНДЕР ВИНТОВКИ
    renderRifle(ctx, bulletColor, scale, effectsLevel) {
        const radius = this.radius * scale;
        const shadowBlur = effectsLevel === 'mobile' ? 15 : 25;
        
        ctx.shadowBlur = shadowBlur;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.life * 0.2);
        
        // Основной квадрат
        ctx.fillStyle = bulletColor;
        ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
        
        // Упрощенные детали для мобильных
        if (effectsLevel === 'desktop') {
            // Крест внутри
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-radius, 0);
            ctx.lineTo(radius, 0);
            ctx.moveTo(0, -radius);
            ctx.lineTo(0, radius);
            ctx.stroke();
        }
        
        ctx.restore();
        
        // Трассер (короче на мобильных)
        const tracerLength = effectsLevel === 'mobile' ? 4 : 8;
        ctx.strokeStyle = bulletColor;
        ctx.lineWidth = effectsLevel === 'mobile' ? 2 : 4;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * tracerLength, this.y - this.vy * tracerLength);
        ctx.stroke();
    }
    
    // РЕНДЕР ДРОБОВИКА
    renderShotgun(ctx, bulletColor, scale, effectsLevel) {
        const radius = this.radius * scale;
        const shadowBlur = effectsLevel === 'mobile' ? 20 : 30;
        
        ctx.shadowBlur = shadowBlur;
        
        if (effectsLevel === 'mobile') {
            // Упрощенная звезда для мобильных
            this.drawSimpleStar(ctx, this.x, this.y, radius);
        } else {
            // Полная мега-звезда для ПК
            this.drawMegaStar(ctx, this.x, this.y, radius);
        }
    }
    
    // РЕНДЕР СНАЙПЕРКИ
    renderSniper(ctx, bulletColor, scale, effectsLevel) {
        const length = effectsLevel === 'mobile' ? 15 * scale : 25 * scale;
        const shadowBlur = effectsLevel === 'mobile' ? 10 : 15;
        
        ctx.shadowBlur = shadowBlur;
        ctx.lineWidth = effectsLevel === 'mobile' ? 4 : 8;
        ctx.strokeStyle = bulletColor;
        ctx.beginPath();
        ctx.moveTo(this.x - length, this.y);
        ctx.lineTo(this.x + length, this.y);
        ctx.stroke();
        
        if (effectsLevel === 'desktop') {
            // Внутренняя белая линия
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#FFFFFF';
            ctx.stroke();
            
            // Точки на концах
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(this.x - length, this.y, 3, 0, Math.PI * 2);
            ctx.arc(this.x + length, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // РЕНДЕР ПЛАЗМЫ
    renderPlasma(ctx, bulletColor, scale, effectsLevel) {
        const baseRadius = this.radius * scale;
        const plasmaSize = baseRadius + Math.sin(this.life * 0.3) * (effectsLevel === 'mobile' ? 2 : 5);
        const shadowBlur = effectsLevel === 'mobile' ? 25 : 40;
        
        ctx.shadowBlur = shadowBlur;
        
        // Основной шар
        ctx.beginPath();
        ctx.arc(this.x, this.y, plasmaSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Энергетические кольца (меньше на мобильных)
        const ringCount = effectsLevel === 'mobile' ? 2 : 4;
        for (let i = 1; i <= ringCount; i++) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, plasmaSize - i * 3, 0, Math.PI * 2);
            ctx.strokeStyle = i % 2 === 0 ? '#FFFFFF' : '#00FF88';
            ctx.lineWidth = effectsLevel === 'mobile' ? 1 : 2;
            ctx.stroke();
        }
        
        if (effectsLevel === 'desktop') {
            // Центральное ядро
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(this.x, this.y, plasmaSize * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // РЕНДЕР ЛАЗЕРА
    renderLaser(ctx, bulletColor, scale, effectsLevel) {
        const length = effectsLevel === 'mobile' ? 10 * scale : 15 * scale;
        const shadowBlur = effectsLevel === 'mobile' ? 30 : 50;
        
        ctx.shadowBlur = shadowBlur;
        ctx.shadowColor = bulletColor;
        
        // Основной луч
        ctx.strokeStyle = bulletColor;
        ctx.lineWidth = effectsLevel === 'mobile' ? 3 : 6;
        ctx.beginPath();
        ctx.moveTo(this.x - length, this.y);
        ctx.lineTo(this.x + length, this.y);
        ctx.stroke();
        
        if (effectsLevel === 'desktop') {
            // Белый центр
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Мерцающие точки
            for (let i = 0; i < 3; i++) {
                const offsetX = (i - 1) * 10;
                ctx.fillStyle = Math.random() > 0.5 ? '#FFFFFF' : bulletColor;
                ctx.beginPath();
                ctx.arc(this.x + offsetX, this.y, 1, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    // РЕНДЕР РАКЕТЫ
    renderRocket(ctx, bulletColor, scale, effectsLevel) {
        const radius = this.radius * scale;
        const shadowBlur = effectsLevel === 'mobile' ? 20 : 35;
        
        ctx.shadowBlur = shadowBlur;
        ctx.save();
        ctx.translate(this.x, this.y);
        const angle = Math.atan2(this.vy, this.vx);
        ctx.rotate(angle);
        
        // Основной корпус
        ctx.fillStyle = bulletColor;
        ctx.fillRect(-radius, -radius/2, radius * 2, radius);
        
        if (effectsLevel === 'desktop') {
            // Нос ракеты
            ctx.beginPath();
            ctx.moveTo(radius, 0);
            ctx.lineTo(radius + 5, -3);
            ctx.lineTo(radius + 5, 3);
            ctx.closePath();
            ctx.fill();
            
            // Огненный хвост
            ctx.fillStyle = '#FF4500';
            const tailLength = 5;
            for (let i = 0; i < tailLength; i++) {
                const tailX = -radius - i * 3;
                const tailSize = (tailLength - i) * 2;
                ctx.fillRect(tailX, -tailSize/2, 3, tailSize);
            }
        } else {
            // Упрощенный хвост для мобильных
            ctx.fillStyle = '#FF4500';
            ctx.fillRect(-radius * 1.5, -radius/4, radius/2, radius/2);
        }
        
        ctx.restore();
    }
    
    // РЕНДЕР ГРАНАТЫ
    renderGrenade(ctx, bulletColor, scale, effectsLevel) {
        const radius = this.radius * scale;
        const shadowBlur = effectsLevel === 'mobile' ? 15 : 25;
        
        ctx.shadowBlur = shadowBlur;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.life * 0.3);
        
        // Основной корпус
        ctx.fillStyle = this.color;
        ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
        
        // Детонатор (всегда мигающий)
        const blinkColor = Math.sin(this.life * 0.5) > 0 ? '#FF0000' : '#FFFF00';
        ctx.fillStyle = blinkColor;
        ctx.fillRect(-radius/3, -radius * 1.2, radius/1.5, radius/2);
        
        if (effectsLevel === 'desktop') {
            // Полоски на корпусе
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            for (let i = -1; i <= 1; i++) {
                ctx.beginPath();
                ctx.moveTo(-radius, i * radius/2);
                ctx.lineTo(radius, i * radius/2);
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }
    
    // РЕНДЕР БЛИЖНЕГО БОЯ
    renderMelee(ctx, bulletColor, scale, effectsLevel) {
        const radius = this.radius * scale;
        const shadowBlur = effectsLevel === 'mobile' ? 30 : 50;
        
        ctx.shadowBlur = shadowBlur;
        
        // Основное кольцо
        ctx.strokeStyle = bulletColor;
        ctx.lineWidth = effectsLevel === 'mobile' ? 8 : 12;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Упрощенные внутренние кольца для мобильных
        const ringCount = effectsLevel === 'mobile' ? 2 : 3;
        for (let i = 1; i <= ringCount; i++) {
            ctx.strokeStyle = i % 2 === 0 ? '#FFFFFF' : bulletColor;
            ctx.lineWidth = effectsLevel === 'mobile' ? 4 - i : 8 - i * 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius - i * 3, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Центральный взрыв
        const explosionSize = Math.sin(this.life * 0.4) * 3 + 5;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x, this.y, explosionSize, 0, Math.PI * 2);
        ctx.fill();
        
        if (effectsLevel === 'desktop') {
            // Искры
            for (let i = 0; i < 8; i++) {
                const sparkAngle = (Math.PI * 2 / 8) * i + this.life * 0.1;
                const sparkX = this.x + Math.cos(sparkAngle) * (radius + 5);
                const sparkY = this.y + Math.sin(sparkAngle) * (radius + 5);
                
                ctx.fillStyle = '#FFFF00';
                ctx.beginPath();
                ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    // БАЗОВЫЙ РЕНДЕР
    renderDefault(ctx, bulletColor, scale, effectsLevel) {
        const radius = this.radius * scale;
        const shadowBlur = effectsLevel === 'mobile' ? 10 : 15;
        
        ctx.shadowBlur = shadowBlur;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = effectsLevel === 'mobile' ? 1 : 2;
        ctx.stroke();
    }
    
    // Упрощенная звезда для мобильных
    drawSimpleStar(ctx, cx, cy, radius) {
        const spikes = 5; // Меньше лучей для мобильных
        const step = Math.PI / spikes;
        const rotation = this.life * 0.1;
        
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? radius : radius * 0.5;
            const angle = i * step + rotation;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        // Простая обводка
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Мега-звезда для ПК (без изменений)
    drawMegaStar(ctx, cx, cy, radius) {
        const spikes = 8;
        const step = Math.PI / spikes;
        const rotation = this.life * 0.15;
        
        // Основная звезда
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? radius : radius * 0.4;
            const angle = i * step + rotation;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        // Толстая белая обводка
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Внутренняя звезда
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? radius * 0.6 : radius * 0.2;
            const angle = i * step + rotation + Math.PI/spikes;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        // Центральный круг
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    // НЕДОСТАЮЩИЕ МЕТОДЫ ДЛЯ ИСПРАВЛЕНИЯ ОШИБОК
    checkAnyObstacleCollision(obstacles) {
        if (!obstacles || obstacles.length === 0) return false;
        
        for (let obstacle of obstacles) {
            if (obstacle && this.checkObstacleCollision(obstacle)) {
                return true;
            }
        }
        return false;
    }
    
    applyElementalEffects(enemy) {
        if (!this.hasElementalDamage || !enemy) return;
        
        // Инициализируем статусные эффекты если их нет
        if (!enemy.statusEffects) {
            enemy.statusEffects = {};
        }
        
        // Электрический урон для плазмы/энергетического оружия
        if (this.weaponClass === 'energy' && this.elementalDamageValue > 0) {
            enemy.statusEffects.shocked = {
                damage: this.elementalDamageValue * 0.2,
                duration: 3,
                ticksRemaining: 180 // 3 секунды при 60 FPS
            };
            
            // Визуальный эффект
            enemy.isShocked = true;
            setTimeout(() => { 
                if (enemy) enemy.isShocked = false; 
            }, 3000);
        }
        
        // Поджигание для зажигательных снарядов
        if (this.incendiary) {
            enemy.statusEffects.burning = {
                damage: this.elementalDamageValue * 0.15,
                duration: 5,
                ticksRemaining: 300 // 5 секунд при 60 FPS
            };
        }
    }
    
    createChainLightning(enemy) {
        if (!window.game || !window.game.enemies || !enemy) return;
        
        // Находим ближайших врагов для цепной молнии
        const nearbyEnemies = window.game.enemies.filter(e => {
            if (e === enemy || e.isDead || !e.health) return false;
            
            const distance = Math.sqrt(
                Math.pow(this.x - e.x, 2) + 
                Math.pow(this.y - e.y, 2)
            );
            
            return distance < 100; // Радиус цепной молнии
        });
        
        // Наносим урон по цепи (максимум 3 цели)
        const chainDamage = Math.floor((this.elementalDamageValue || 20) * 0.7);
        const maxTargets = Math.min(nearbyEnemies.length, 3);
        
        for (let i = 0; i < maxTargets; i++) {
            const targetEnemy = nearbyEnemies[i];
            if (targetEnemy && targetEnemy.health > 0) {
                targetEnemy.health -= chainDamage;
                
                // Создаем визуальный эффект молнии
                this.createLightningEffect(enemy.x, enemy.y, targetEnemy.x, targetEnemy.y);
            }
        }
        
        if (maxTargets > 0) {
            console.log(`⚡ Цепная молния! Поражено ${maxTargets} врагов урон: ${chainDamage}`);
        }
    }
    
    createLightningEffect(x1, y1, x2, y2) {
        // Создаем простой визуальный эффект молнии
        if (window.game && window.game.addVisualEffect) {
            window.game.addVisualEffect({
                type: 'lightning',
                x1: x1, y1: y1, x2: x2, y2: y2,
                duration: 10, // кадров
                color: '#FFFFFF'
            });
        }
    }
    
    renderTracer(ctx, bulletColor) {
        if (!ctx) return;
        
        const isMobile = this.detectMobileDevice();
        const tracerLength = isMobile ? 4 : 8;
        
        ctx.strokeStyle = bulletColor;
        ctx.lineWidth = isMobile ? 2 : 4;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * tracerLength, this.y - this.vy * tracerLength);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    
    renderEnergyEffects(ctx, bulletColor) {
        if (!ctx) return;
        
        const isMobile = this.detectMobileDevice();
        
        // Энергетическое свечение
        ctx.shadowBlur = this.radius * (isMobile ? 3 : 6);
        ctx.shadowColor = bulletColor;
        
        // Пульсирующий эффект
        const pulse = Math.sin(this.life * 0.4) * 0.3 + 0.7;
        ctx.globalAlpha = pulse;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = bulletColor;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    
    // МОБИЛЬНАЯ СИСТЕМА УПРАВЛЕНИЯ
    static createMobileControls() {
        if (!this.detectMobileDevice()) return;
        
        // Создаем контейнер для мобильных контролов
        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'mobile-controls';
        controlsContainer.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 200px;
            background: rgba(0, 0, 0, 0.3);
            z-index: 1000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            box-sizing: border-box;
        `;
        
        // Левая часть - джойстик движения
        const moveJoystick = this.createJoystick('move-joystick', 'Движение');
        moveJoystick.style.left = '20px';
        
        // Центр - кнопки оружия
        const weaponPanel = this.createWeaponPanel();
        
        // Правая часть - джойстик прицеливания и стрельбы
        const aimJoystick = this.createJoystick('aim-joystick', 'Прицел');
        aimJoystick.style.right = '20px';
        
        const fireButton = this.createFireButton();
        
        controlsContainer.appendChild(moveJoystick);
        controlsContainer.appendChild(weaponPanel);
        controlsContainer.appendChild(aimJoystick);
        controlsContainer.appendChild(fireButton);
        
        document.body.appendChild(controlsContainer);
        
        // Инициализируем обработчики
        this.initMobileHandlers();
        
        console.log('📱 Мобильное управление активировано!');
    }
    
    static createJoystick(id, label) {
        const joystick = document.createElement('div');
        joystick.id = id;
        joystick.style.cssText = `
            width: 120px;
            height: 120px;
            border: 3px solid #fff;
            border-radius: 50%;
            position: relative;
            background: rgba(255, 255, 255, 0.1);
            touch-action: none;
            user-select: none;
        `;
        
        const stick = document.createElement('div');
        stick.className = 'joystick-stick';
        stick.style.cssText = `
            width: 40px;
            height: 40px;
            background: #fff;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: all 0.1s ease;
        `;
        
        const labelEl = document.createElement('div');
        labelEl.textContent = label;
        labelEl.style.cssText = `
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 12px;
            text-align: center;
        `;
        
        joystick.appendChild(stick);
        joystick.appendChild(labelEl);
        
        return joystick;
    }
    
    static createWeaponPanel() {
        const panel = document.createElement('div');
        panel.id = 'weapon-panel';
        panel.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: center;
        `;
        
        // Кнопка смены оружия
        const weaponButton = document.createElement('button');
        weaponButton.id = 'weapon-switch';
        weaponButton.textContent = '🔫 PISTOL';
        weaponButton.style.cssText = `
            padding: 10px 15px;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid #fff;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            font-size: 14px;
            touch-action: manipulation;
        `;
        
        // Индикатор патронов
        const ammoDisplay = document.createElement('div');
        ammoDisplay.id = 'ammo-display';
        ammoDisplay.textContent = '12/12';
        ammoDisplay.style.cssText = `
            color: white;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
        `;
        
        // Кнопка перезарядки
        const reloadButton = document.createElement('button');
        reloadButton.id = 'reload-button';
        reloadButton.textContent = '🔄';
        reloadButton.style.cssText = `
            padding: 8px 12px;
            background: rgba(255, 165, 0, 0.3);
            border: 2px solid #ffa500;
            border-radius: 8px;
            color: white;
            font-size: 18px;
            touch-action: manipulation;
        `;
        
        panel.appendChild(weaponButton);
        panel.appendChild(ammoDisplay);
        panel.appendChild(reloadButton);
        
        return panel;
    }
    
    static createFireButton() {
        const fireButton = document.createElement('button');
        fireButton.id = 'fire-button';
        fireButton.textContent = '🔥';
        fireButton.style.cssText = `
            width: 80px;
            height: 80px;
            border: 3px solid #ff4444;
            border-radius: 50%;
            background: rgba(255, 68, 68, 0.3);
            color: white;
            font-size: 24px;
            font-weight: bold;
            position: absolute;
            bottom: 140px;
            right: 30px;
            touch-action: manipulation;
            user-select: none;
        `;
        
        return fireButton;
    }
    
    static initMobileHandlers() {
        // Джойстик движения
        this.setupJoystickHandler('move-joystick', (deltaX, deltaY) => {
            if (window.game && window.game.player) {
                window.game.player.vx = deltaX * 5;
                window.game.player.vy = deltaY * 5;
            }
        });
        
        // Джойстик прицеливания
        this.setupJoystickHandler('aim-joystick', (deltaX, deltaY) => {
            if (window.game && window.game.player) {
                window.game.player.aimAngle = Math.atan2(deltaY, deltaX);
            }
        });
        
        // Кнопка стрельбы
        const fireButton = document.getElementById('fire-button');
        let isFiring = false;
        
        fireButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isFiring = true;
            this.startAutoFire();
            fireButton.style.background = 'rgba(255, 68, 68, 0.8)';
        });
        
        fireButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            isFiring = false;
            this.stopAutoFire();
            fireButton.style.background = 'rgba(255, 68, 68, 0.3)';
        });
        
        // Смена оружия
        const weaponButton = document.getElementById('weapon-switch');
        weaponButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.switchWeapon();
        });
        
        // Перезарядка
        const reloadButton = document.getElementById('reload-button');
        reloadButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.reloadWeapon();
        });
        
        // Обновление интерфейса
        setInterval(() => this.updateMobileUI(), 100);
    }
    
    static setupJoystickHandler(joystickId, callback) {
        const joystick = document.getElementById(joystickId);
        const stick = joystick.querySelector('.joystick-stick');
        let isDragging = false;
        
        const handleStart = (e) => {
            e.preventDefault();
            isDragging = true;
            joystick.style.background = 'rgba(255, 255, 255, 0.3)';
        };
        
        const handleMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const rect = joystick.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const touch = e.touches ? e.touches[0] : e;
            const deltaX = touch.clientX - centerX;
            const deltaY = touch.clientY - centerY;
            
            // Ограничиваем движение в пределах джойстика
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = 40; // Радиус джойстика
            
            let finalX = deltaX;
            let finalY = deltaY;
            
            if (distance > maxDistance) {
                finalX = (deltaX / distance) * maxDistance;
                finalY = (deltaY / distance) * maxDistance;
            }
            
            // Обновляем позицию стика
            stick.style.transform = `translate(${finalX - 20}px, ${finalY - 20}px)`;
            
            // Вызываем callback с нормализованными значениями
            const normalizedX = finalX / maxDistance;
            const normalizedY = finalY / maxDistance;
            callback(normalizedX, normalizedY);
        };
        
        const handleEnd = (e) => {
            e.preventDefault();
            isDragging = false;
            stick.style.transform = 'translate(-20px, -20px)';
            joystick.style.background = 'rgba(255, 255, 255, 0.1)';
            callback(0, 0); // Остановка движения
        };
        
        // Touch events
        joystick.addEventListener('touchstart', handleStart);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', handleEnd);
        
        // Mouse events (для тестирования на ПК)
        joystick.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
    }
    
    static startAutoFire() {
        if (this.autoFireInterval) return;
        
        this.autoFireInterval = setInterval(() => {
            if (window.game && window.game.player) {
                this.fireBullet();
            }
        }, 100); // Стрельба каждые 100ms
    }
    
    static stopAutoFire() {
        if (this.autoFireInterval) {
            clearInterval(this.autoFireInterval);
            this.autoFireInterval = null;
        }
    }
    
    static fireBullet() {
        if (!window.game || !window.game.player) return;
        
        const player = window.game.player;
        const weaponType = player.currentWeapon || 'pistol';
        
        // Проверяем патроны
        if (player.ammo <= 0) {
            this.showMessage('Нет патронов!');
            return;
        }
        
        const bullets = this.createWeaponBullet(
            player.x, 
            player.y, 
            player.aimAngle || 0, 
            weaponType, 
            player
        );
        
        if (bullets) {
            bullets.forEach(bullet => {
                if (window.game.bullets) {
                    window.game.bullets.push(bullet);
                }
            });
            
            player.ammo--;
            this.updateAmmoDisplay();
        }
    }
    
    static switchWeapon() {
        if (!window.game || !window.game.player) return;
        
        const currentWeapon = window.game.player.currentWeapon || 'pistol';
        const nextWeapon = this.getNextWeaponType(currentWeapon);
        
        window.game.player.currentWeapon = nextWeapon;
        
        // Перезаряжаем при смене оружия
        const stats = this.getWeaponStats(nextWeapon);
        window.game.player.ammo = stats.ammo;
        window.game.player.maxAmmo = stats.ammo;
        
        this.updateWeaponDisplay();
        this.showMessage(`Оружие: ${stats.name}`);
    }
    
    static reloadWeapon() {
        if (!window.game || !window.game.player) return;
        
        const player = window.game.player;
        const weaponType = player.currentWeapon || 'pistol';
        const stats = this.getWeaponStats(weaponType);
        
        if (player.ammo >= stats.ammo) {
            this.showMessage('Уже заряжено!');
            return;
        }
        
        // Анимация перезарядки
        const reloadButton = document.getElementById('reload-button');
        reloadButton.textContent = '⏳';
        reloadButton.disabled = true;
        
        setTimeout(() => {
            player.ammo = stats.ammo;
            this.updateAmmoDisplay();
            reloadButton.textContent = '🔄';
            reloadButton.disabled = false;
            this.showMessage('Перезарядка завершена!');
        }, stats.reloadTime || 1000);
    }
    
    static updateMobileUI() {
        this.updateWeaponDisplay();
        this.updateAmmoDisplay();
    }
    
    static updateWeaponDisplay() {
        const weaponButton = document.getElementById('weapon-switch');
        if (!weaponButton || !window.game || !window.game.player) return;
        
        const weaponType = window.game.player.currentWeapon || 'pistol';
        const stats = this.getWeaponStats(weaponType);
        const icon = this.getWeaponIcon(weaponType);
        
        weaponButton.textContent = `${icon} ${stats.name.toUpperCase()}`;
    }
    
    static updateAmmoDisplay() {
        const ammoDisplay = document.getElementById('ammo-display');
        if (!ammoDisplay || !window.game || !window.game.player) return;
        
        const player = window.game.player;
        const maxAmmo = player.maxAmmo || 12;
        const currentAmmo = player.ammo || 0;
        
        ammoDisplay.textContent = `${currentAmmo}/${maxAmmo}`;
        ammoDisplay.style.color = currentAmmo <= maxAmmo * 0.2 ? '#ff4444' : 'white';
    }
    
    static getWeaponIcon(weaponType) {
        const icons = {
            pistol: '🔫',
            rifle: '🔫',
            shotgun: '💥',
            sniper: '🎯',
            plasma: '⚡',
            laser: '🔴',
            rocket: '🚀',
            grenade: '💣',
            melee: '⚔️'
        };
        return icons[weaponType] || '🔫';
    }
    
    static showMessage(text) {
        // Создаем временное сообщение
        const message = document.createElement('div');
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 2000;
            pointer-events: none;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            document.body.removeChild(message);
        }, 2000);
    }
    
    // ДЕТЕКЦИЯ МОБИЛЬНОГО УСТРОЙСТВА
    detectMobileDevice() {
        if (typeof window === 'undefined') return false;
        
        // Проверяем User Agent
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        
        // Проверяем размер экрана
        const screenWidth = window.innerWidth || document.documentElement.clientWidth;
        const screenHeight = window.innerHeight || document.documentElement.clientHeight;
        const isSmallScreen = screenWidth <= 768 || screenHeight <= 768;
        
        // Проверяем touch events
        const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        return mobileRegex.test(userAgent) || (isSmallScreen && hasTouchScreen);
    }
    
    // МАСШТАБИРОВАНИЕ ДЛЯ МОБИЛЬНЫХ
    getMobileScaleFactor() {
        if (typeof window === 'undefined') return 1;
        
        const screenWidth = window.innerWidth || 800;
        const baseWidth = 800; // Базовая ширина для ПК
        
        // Увеличиваем пули на маленьких экранах для лучшей видимости
        if (screenWidth < 480) return 1.5;
        if (screenWidth < 768) return 1.3;
        return 1.2; // Небольшое увеличение для планшетов
    }
    
    // ОЧИСТКА ПАМЯТИ
    destroy() {
        this.hitTargets = null;
        this.hitTarget = null;
        if (this.soundEffects) {
            this.soundEffects = null;
        }
    }
    
    // СТАТИЧЕСКИЕ МЕТОДЫ ДЛЯ СОВМЕСТИМОСТИ
    static getWeaponClasses() {
        return {
            pistol: { name: 'Пистолеты', types: ['pistol', 'revolver', 'dual_pistol'] },
            automatic: { name: 'Автоматы', types: ['rifle', 'smg', 'lmg'] },
            shotgun: { name: 'Дробовики', types: ['shotgun', 'combat_shotgun', 'auto_shotgun'] },
            sniper: { name: 'Снайперки', types: ['sniper', 'anti_material', 'hunting_rifle'] },
            energy: { name: 'Энергетическое', types: ['plasma', 'laser', 'ion_cannon'] },
            explosive: { name: 'Взрывчатка', types: ['rocket', 'grenade_launcher', 'bazooka'] },
            melee: { name: 'Ближний бой', types: ['melee', 'sword', 'chainsaw'] }
        };
    }

    // СТАТИЧЕСКИЕ МЕТОДЫ ДЛЯ СОЗДАНИЯ ОРУЖИЯ
    static createBullet(x, y, angle, speed, weaponType) {
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        return new Bullet(x, y, vx, vy, weaponType);
    }
    
    static createShotgunBullets(x, y, angle, speed, weaponType = 'shotgun') {
        const bullets = [];
        const pelletCount = 8;
        const spread = 0.4;
        
        for (let i = 0; i < pelletCount; i++) {
            const pelletAngle = angle + (Math.random() - 0.5) * spread;
            const pelletSpeed = speed + (Math.random() - 0.5) * 2;
            bullets.push(this.createBullet(x, y, pelletAngle, pelletSpeed, weaponType));
        }
        
        return bullets;
    }
    
    static createWeaponBullet(x, y, angle, weaponType, player) {
        const stats = this.getWeaponStats(weaponType);
        const speed = stats.speed;
        
        // Проверка времени последнего выстрела
        const now = Date.now();
        if (player && player.lastShotTime && (now - player.lastShotTime) < stats.fireRate) {
            return null;
        }
        
        if (player) {
            player.lastShotTime = now;
        }
        
        // Для дробовика создаем несколько пуль
        if (weaponType === 'shotgun') {
            return this.createShotgunBullets(x, y, angle, speed, weaponType);
        } else {
            return [this.createBullet(x, y, angle, speed, weaponType)];
        }
    }
    
    // РАСШИРЕННЫЕ ХАРАКТЕРИСТИКИ ОРУЖИЯ
    static getWeaponStats(weaponType) {
        const stats = {
            pistol: { 
                damage: 25, fireRate: 300, accuracy: 0.95, reloadTime: 1000,
                name: 'Пистолет', ammo: 12, speed: 8, rarity: 'common',
                description: 'Надежное базовое оружие с возможностью рикошета'
            },
            rifle: { 
                damage: 40, fireRate: 150, accuracy: 0.88, reloadTime: 2000,
                name: 'Штурмовая винтовка', ammo: 30, speed: 12, rarity: 'common',
                description: 'Автоматическое оружие с трассирующими пулями'
            },
            shotgun: { 
                damage: 60, fireRate: 800, accuracy: 0.65, reloadTime: 2500,
                name: 'Дробовик', ammo: 8, speed: 6, pellets: 8, rarity: 'uncommon',
                description: 'Мощное оружие ближнего боя с разбросом'
            },
            sniper: { 
                damage: 120, fireRate: 1500, accuracy: 0.99, reloadTime: 3000,
                name: 'Снайперская винтовка', ammo: 5, speed: 15, rarity: 'rare',
                description: 'Высокоточное оружие, пробивает стены'
            },
            plasma: { 
                damage: 80, fireRate: 400, accuracy: 0.82, reloadTime: 2200,
                name: 'Плазменная пушка', ammo: 20, speed: 10, rarity: 'epic',
                description: 'Энергетическое оружие с цепной молнией'
            },
            laser: { 
                damage: 15, fireRate: 50, accuracy: 1.0, reloadTime: 500,
                name: 'Лазерная винтовка', ammo: 100, speed: 20, rarity: 'epic',
                description: 'Быстрая стрельба, пробивает всё'
            },
            rocket: { 
                damage: 150, fireRate: 2000, accuracy: 0.75, reloadTime: 4000,
                name: 'Ракетомет', ammo: 3, speed: 7, rarity: 'legendary',
                description: 'Взрывные ракеты большого радиуса'
            },
            grenade: {
                damage: 200, fireRate: 3000, accuracy: 0.80, reloadTime: 2000,
                name: 'Граната', ammo: 5, speed: 4, rarity: 'uncommon',
                description: 'Взрывчатка с задержкой и отскоком'
            },
            melee: {
                damage: 300, fireRate: 1000, accuracy: 1.0, reloadTime: 0,
                name: 'Ближний бой', ammo: 999, speed: 2, rarity: 'common',
                description: 'Мощные атаки в упор с казнью'
            }
        };
        
        return stats[weaponType] || stats.pistol;
    }
    
    // УТИЛИТЫ
    static getNextWeaponType(currentWeapon) {
        const weapons = ['pistol', 'rifle', 'shotgun', 'sniper', 'plasma', 'laser', 'rocket', 'grenade', 'melee'];
        const currentIndex = weapons.indexOf(currentWeapon);
        const nextIndex = (currentIndex + 1) % weapons.length;
        return weapons[nextIndex];
    }
}

// Глобальная инициализация с улучшениями
if (typeof window !== 'undefined') {
    console.log('🔫 УЛУЧШЕННАЯ СИСТЕМА ОРУЖИЯ АКТИВИРОВАНА!');
    console.log('⚡ Добавлены классы оружия и реалистичная физика');
    console.log('🎯 Доступные классы:', Object.keys(Bullet.getWeaponClasses()).join(', '));
    
    // Инициализируем мобильное управление
    document.addEventListener('DOMContentLoaded', () => {
        if (Bullet.detectMobileDevice()) {
            Bullet.createMobileControls();
            console.log('📱 Мобильное управление инициализировано!');
        }
    });
    
    // Добавляем очистку памяти
    window.bulletCleanup = function() {
        if (window.game && window.game.bullets) {
            // Ограничиваем количество пуль на экране
            if (window.game.bullets.length > 100) {
                window.game.bullets.splice(0, window.game.bullets.length - 100);
            }
            
            // Очищаем уничтоженные пули
            window.game.bullets = window.game.bullets.filter(bullet => {
                if (bullet.hitType) {
                    if (bullet.destroy) bullet.destroy();
                    return false;
                }
                return true;
            });
        }
    };
    
    // Запускаем очистку каждые 5 секунд вместо постоянного создания пуль
    setInterval(window.bulletCleanup, 5000);
}
