/**
 * Système de particule pour traitement des vertiges
 * @author Olivier ROGER <roger.olivier@gmail.com>
 */

(function() {
    //Initialisation du canvas
    var canvas      = document.getElementById("canvas");
    var button1     = document.getElementById("goMode1");
    var button2     = document.getElementById("goMode2");
    var btnFull     = document.getElementById("full");
    var ctx         = canvas.getContext("2d");
    var direction   = 'horizontal';
    var taille      = 5;
    var nombre      = 100;
    var vitesse     = 5;
    var vitesseInt  = new Array();
    var tempsInt    = new Array();
    var particles   = [];
    var timeElapsed = 0;
    var timeSpeedElapsed = 0;
    var alternance  = 0;
    var speedAlternance = 0;
    var mode        = 1;

    //Taille
    var W = 1024; var H = 768;

    //Event
    button1.addEventListener("click", function(){initMode(1)}, false);
    button2.addEventListener("click", function(){initMode(2)}, false);
    btnFull.addEventListener("click", setFullScreen, false);
    if (screenfull.enabled) {
        screenfull.onchange = function() {
            if(screenfull.isFullscreen) {
                canvas.width    = screen.width;
                canvas.height   = screen.height;
                W = screen.width;
                H = screen.height;
                change();
            } else {
                canvas.width    = 1024;
                canvas.height   = 768;
                W = 1024;
                H = 768;
                change();
            }
        };
    }
    
    function initMode(numMode)
    {
        mode = numMode;
        change();
    }

    /**
     * Recréation de nouvelles particules avec les paramètres saisie
     */
    function change()
    {
        
        direction   = document.getElementById("direction").value;
        taille      = parseInt(document.getElementById("taille").value,10);
        nombre      = parseInt(document.getElementById("nombre").value,10);
        particles.length = 0;
        
        if(mode == 1)
        {
            vitesse     = parseInt(document.getElementById("vitesse").value,10);      
            alternance  = parseInt(document.getElementById("alt").value,10) * 1000;

            for(var i = 0; i < nombre; i++)
            {
                particles.push(new createParticle(vitesse));
            }
        }
        else
        {
            vitesseInt[0] = parseInt(document.getElementById("vitesseint1").value,10);
            vitesseInt[1] = parseInt(document.getElementById("vitesseint2").value,10);
            tempsInt[0] = parseInt(document.getElementById("tpsint1").value,10);
            tempsInt[1] = parseInt(document.getElementById("tpsint2").value,10);
            alternance  = parseInt(document.getElementById("alt2").value,10) * 1000;
            
            var vitesseGlobale = Math.floor(Math.random() * vitesseInt[1]) + vitesseInt[0];
            speedAlternance = (Math.floor(Math.random() * tempsInt[1]) + tempsInt[0]) * 1000;
            for(var j = 0; j < nombre; j++)
            {
                particles.push(new createParticle(vitesseGlobale));
            }
        }    
        
    }
    
    
    /**
     * Passage en plein écran
     */
    function setFullScreen()
    {
        if (screenfull.enabled) {
            screenfull.request(canvas);
            change();
        }
    }
    
    /**
     * Inversion de la direction de déplacement
     */
    function reverseDirection()
    {
        for(var i = 0; i < nombre; i++)
        {
            var p = particles[i];

            p.vx = opposite(p.vx);
            p.vy = opposite(p.vy);

        }    
    }
    
    function changeSpeed()
    {
        if(mode == 2)
        {
            var vitesseGlobal = Math.floor(Math.random() * vitesseInt[1]) + vitesseInt[0];
            var p = null;
            for(var i = 0; i < nombre; i++)
            {
                p = particles[i];
                
                if(p.vx != 0) {
                    p.vx = (p.vx > 0) ? vitesseGlobal : -vitesseGlobal;
                } 
                
                if(p.vy != 0) {
                    p.vy = (p.vy > 0) ? vitesseGlobal : -vitesseGlobal;
                } 
            }
        }
    }
    
    /**
     * Inverse une valeur
     * @param num Valeur à inverser
     */
    function opposite(num)
    {
        return -(parseInt(num,10));
    }
    
    /**
     * Vérifie si il est nécessaire d'inverser le sens de défilement
     */
    function checkForAlternance()
    {
        if(alternance > 0 && timeElapsed > alternance) {
            reverseDirection();
            timeElapsed = 0;
        }
        
        if(speedAlternance > 0 && timeSpeedElapsed > speedAlternance) {
            changeSpeed();
            timeSpeedElapsed = 0;
        }
    }

    /**
     * Création d'un ensemble de particule
     */
    function createParticle(vitesseParticle)
    {
        //Position initiale
        this.x = Math.random()*W;
        this.y = Math.random()*H;

        //Velocité
        if(direction == 'verticalhb') {
            this.vx = 0;
            this.vy = vitesseParticle;
        } else if(direction == 'verticalbh') {
            this.vx = 0;
            this.vy = -vitesseParticle;
        } else if(direction == 'horizontalgd') {
            this.vx = vitesseParticle;
            this.vy = 0;
        } else if(direction == 'horizontaldg') {
            this.vx = -vitesseParticle;
            this.vy = 0;
        }

        this.radius = taille;//Math.random()*20+20;
    }
    
    /**
     * Dessin
     */
    function draw()
    {
        //Remplissage du canvas
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, W, H);
        checkForAlternance();

        for(var t = 0; t < particles.length; t++)
        {
            var p = particles[t];

            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.arc(p.x, p.y, p.radius, Math.PI*2, false);
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;

            //On empèche les particules de sortir de l'écran
            if(p.x < -10) p.x = W+10;
            if(p.y < -10) p.y = H+10;
            if(p.x > W+10) p.x = -10;
            if(p.y > H+10) p.y = -10;
        }
        timeElapsed += 33;
        timeSpeedElapsed += 33;
    }
    
    setInterval(draw, 33);
})();