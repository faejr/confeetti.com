/* compact way of setting PI = Math.PI & so on... */
Object.getOwnPropertyNames(Math).map(function(p) {
    window[p] = Math[p]
  });
  /* oh, why? because I',m lazy, that's why! :P */
  
  
  
  
  
  /*
   * =============================================
   * GLOBALS
   * =============================================
   */
  var N_PARTICLES = 256, 
      
      c = document.querySelector('.c') /* canvas elem */, 
      w /* canvas width */, h /* canvas height */, 
      ctx = c.getContext('2d') /* get canvas context */,
      confettis = [],
      particles = [], 
      source = {} /* particle fountain source */, 
      t = 0, 
      req_id = null;
  
  
  
  
  
  /*
   * =============================================
   * OBJECTS USED
   * =============================================
   */
  var Particle = function(i) {
    var confetti /* current confetti piece */, 
        pos /* current particle position */, 
        v /* current particle velocity */, 
        a /* current particle acceleration */, 
        c_angle /* confetti particle angle */,
        angle_v /* angle velocity */,
        /* delay when shooting up 
         * so that they don't go all up at the same time
         * randomly generated
         */
        delay = rand(N_PARTICLES, 0, 1);
    
    /* active = was already shot up, but hasn't landed yet */
    this.active = false;
    
    /*
     * make particle active and give it a velocity so that 
     * it can start moving
     */
    this.shoot = function(ctx) {
      var angle, angle_var, val, 
          hue = rand(360, 0, 1);
      
      /* check if time for shooting this particle has arrived */
      if(t - delay >= 0) {
        /* make it active */
        this.active = true;
        
        /* choose our confetti */
        confetti = confettis[floor(random() * confettis.length)];
  
        /* position it at the fountain source, 
         * but a bit lower, depending on its radius
         */
        pos = { 'x': source.x + rand(-10, 10), 'y': source.y };
        
        /*
         * give it an acceleration considering gravity
         * and uniform friction (depending on its radius)
         */
        a = { 'x': 0, 'y': .4 };
        
        /* generate a random angle at which it shoots up */
        angle = rand(PI/8, -PI/8) - PI/2;
        
        /* Set up our confetti particle angle */
        c_angle = 0;
           angle_v = rand(-30, 30);
        
        /* generate random velocity absolute value in that direction */
        val = rand(h/21, h/60);
        
        /* compute initial velocity components */
        v = {
          'x': val*cos(angle), 
          'y': val*sin(angle)
        };
      }
    };
    
    /*
     * particle is in motion, update its velocity and position
     */
    this.motionUpdate = function() {
      /*
       * velocity_incr = acceleration * time_incr
       * position_incr = velocity * time_incr
       * but time_incr = 1 in our case
       * (see the t++ line in drawOnCanvas)
       * so compute new velocity and position components
       * based on this
       */
      v.x += a.x;
      v.y += a.y;
      pos.x += round(v.x);
      pos.y += round(v.y);
      c_angle += angle_v;
  
      /* if it has landed = it's below canvas bottom edge */
      if(pos.y > h | pos.x < 0 | pos.x > w) {
        /* reset position to the initial one */
        pos = { 'x': source.x, 'y': source.y };
        /* ... and make this particle inactive */
        this.active = false;
      }
    };
    
    this.draw = function(ctx) {
      ctx.save(); 
      
      ctx.translate(pos.x, pos.y);
      ctx.rotate(c_angle * Math.PI / 180);
  
      ctx.drawImage(confetti, -(confetti.width/2), -(confetti.height/2));
  
      ctx.restore(); 
      
      /* update its velocity and position */
      this.motionUpdate();
    };
  }
  
  
  
  
  
  /*
   * =============================================
   * FUNCTIONS
   * =============================================
   */
  
  /* 
   * generates a random number in the [min, max) interval
   * max: upper boundary for generated number; 
   *      defaults to 1
   * min: lower boundary for generated number; 
   *      defaults to 0
   * _int: flag specifying if generated number 
   *       should be rounded to the nearest integer
   *       falsy by default
   */
  var rand = function(max, min, _int) {
    var max = (max === 0 || max)?max:1, 
        min = min || 0, 
        gen = min + (max - min)*random();
    
    return (_int)?round(gen):gen;
  };
  
  
  /* Load up some confetti! */
  var loadConfetti = function() {
    confetti_orange = new Image;
    confetti_orange.src = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAeBQTFRFAAAA/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9td/9xd/9xd/9xd9rRP8JlG/tZb/9xd97hQ75ZF+sRV/9xd/9xd+sZW+L9T/9xd/9xd+cRV/9xd/9xd+sdW8qJJ75dF/9xd/9xd/9xd/9xd/9xd97pR9bFO/9xd/9xd/9xd/9xd/9tc8JtG/dVa/9xd/9xd/9xd/tdb9a9O8JxH8JpG+8pX/9xd/9xd/9xd/9xd/9xd/9xd/M9Z75hG8Z1H/9xd/9xd/9xd+sVV/9xd/9xd/tpc/9xd+L1S8JtH9rZQ/9xd/9xd/9xd+cNU/thc/9xd/9xd97tR/M5Y/9xd/9xd/9xd/9xd/NFZ+8lW/9xd/9xd8Z9I/9xd/tVb8aBI9KtM9rNP/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xd/9xdvsj5IAAAAKB0Uk5TAAxWns3i07qcbkokz//suW3wnRcj82I6QFR1b1iRNK0U1+uhZl1Bp9sNNaX/3Cz3////xP///8WI///A/P/LgP////sIBnjp//8yEXzj////DkaQ///////ZFR0/Z6////9JyLb/Kyj/n////2ASR///MKv//zdXQ/L//1nQ/1X6////erIDYRP5x4pcQhogLnKxvIMPknmpoL5LGEw+KWyqkRsAAAIuSURBVHicY2AYBaNgFAw5wMjEzMLKysbOwcnFTZYBPLwIwMcvwEiyA3hRgaCQMGkGiPCiA1ExkgwQxzCAl1eCFAMksRggRYoB0lgMkCHFAFksBsiRYoA8FgMUSDGABVO/Iin6GZQwDVAmRT83Fh+okGKAKhYD1EgxQB2LASKkGKCBxQBNEvRrYdEvSooDtFH16oAIXRL06+mj6DcwNAKSLCQYYIzqABNTMyBpTrx+CzTfW5paAUlrovUL2KAZYAs2wI5Y/fbo+oFecACSGsRpF2bHjEBHJ1AgOrsQod3VzR1Tv4epJ5j2Iqjd28cXU7ufiZN/AJgljV93YFCwKKb2kNAw0/AICDsSi66oaCDQi4m1iNPACDowiE9INDGCcZIwnGyHXRcy0EFiJ6MFmFqKpUkqQROQQRqy/nTWjIwMkrTz8tojG5CZFZadnUOaAawI7bmsJFoOAXkw/fk2BQYGBjmFpBpQBDOguMTJ1NTUqZRUA7jAusv4RQlHH3ZQDtJfUclbVQ0CIaQbUAMyoNaszhQM6kg3oB6on7GhsSm0GQTMSDcAWLe4tqCkThKBAgNDK/m6weVqPiX6QdlRihL9cW0MDO0U6FcEJeQOfULKOru6e3q9RPr6J+RPnOSMJDFZAZwMp+DVPFllAkrZO1VimiBEikWmDSo2XR9q0YyZxbMEkV04rSIQS6nHkJ6v2jO7vw0h0NGrKiYjDm08zxGfW6PaUz973nySW9NDFQAAM0mdWaN6a88AAAAASUVORK5CYII=";
      confettis.push(confetti_orange);
  
      confetti_blue = new Image;
      confetti_blue.src = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAblQTFRFAAAAXX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//T472Rp7wW4H+XX//UI/3RaHvVYf6XX//XX//Voj6U4n4XX//XX//VYf5XX//XX//SZjyXX//XX//XX//XX//XX//UYv3TpH1XX//XX//XX//XX//XH//WoD9XX//XX//XX//R57wV4X7XX//XX//XX//XX//XX//XX//WYP8Rp3vR5fxXX//XX//XX//XX//XX//XH7+XX//Uoz4UI72XX//XX//XX//VIb5XX//XX//WIL8XX//XX//XX//XX//VoX7XX//XX//SJfxXX//W4H+TJP0T5L2XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//XX//9t8QfwAAAJN0Uk5TAAxWns3i07qcbkokz//suW3wnRcj82I6QFR1b1iRNK0U1+uhZl1Bp9sNNaXcLPf////E////xYj//8D8/8uA//sIBnjp//8yEXzj//8ORpD//9kVHT9nr////0nItiso/5///2ASR/8wq/83V0Py/1nQ/1X6//96sgNhE/nHilxCGiAucrG8gw+SeamgvksYTD4pvmxrKQAAAiNJREFUeJztlvdb2kAYx0MldZ6KgjhQcaDUwShBaa3WiVvR1r1oVeoe2EW1xbp31b/YS4AnkLtKXvnJ5+H7wyUkfD733uU4wjDxxBPPs4viRYKSZV8mJiWnpD5JkIbEpGdkKsAFoMiosrJhAjWSRpMDEmgJAUK5EEEeRZAPERRQBDqIoJAiKIIIiikCPUSgJPkSCM+UkoIyCJ9KGUE5RGCgCCoggkqKQA0RGCmCVwC+isJrIAVUUwQ1AL7WFIGaLVbcKgGC15F92zg7buvk8/WS4h3cG9y+lc1nNkgE7wRBo1y+ScrjIThwa5SHZyeS8/+e4yexuUUG3trWTvIdnFM4dkbFu7p7SLzXxln6hLOCx+n+gUENiVudLs4yFDgfplAfPuLUjozWjxmJqRMyPjFps4Y+TBElN9Kp/2VaMmEVMw6bHWSYDefnWLfbDcIRagoXfPrscrnmYQJWxBdYYOeBLIZ4T8MXs9k8Dx0CWgoJljs4PitQQYpAr2ZoYI9PzBrPr2+g8U0+1uiANFu8YNvuFernvHDBDuYVX73fnN/5wBaREPzf0voDjonRM8zPWHi8r3pi4fmfY34s/JiPYX7FwJfwC3nXFO1re7//+Pc71X8PDj1Hx81hN070wjI8fRQ+KT+M2HvPcs9VgVtKnS947cIU7OjyavlaFV7h+Xo/Zddj5jwG/82BT7ywu2/I0WmDL8//tLdbBv/Ozd09+G36ueYBouWWJdGhn1QAAAAASUVORK5CYII=";
      confettis.push(confetti_blue);
  
      confetti_purple = new Image;
      confetti_purple.src = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAblQTFRFAAAAeF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/T0/2Rl7wclv+eF3/UFD3RWHvYVX6eF3/eF3/Ylb6W1P4eF3/eF3/YVX5eF3/eF3/SVnyeF3/eF3/eF3/eF3/eF3/VVH3TlL1eF3/eF3/eF3/eF3/d1z/cVr9eF3/eF3/eF3/R1/wZlf7eF3/eF3/eF3/eF3/eF3/eF3/bFn8Rl7vR1fxeF3/eF3/eF3/eF3/eF3/d1z+eF3/VlL4UFD2eF3/eF3/eF3/YFT5eF3/eF3/a1j8eF3/eF3/eF3/eF3/Zlb7eF3/eF3/SFjxeF3/clv+TFT0T1P2eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/eF3/9XDp7wAAAJN0Uk5TAAxWns3i07qcbkokz//suW3wnRcj82I6QFR1b1iRNK0U1+uhZl1Bp9sNNaXcLPf////E////xYj//8D8/8uA//sIBnjp//8yEXzj//8ORpD//9kVHT9nr////0nItiso/5///2ASR/8wq/83V0Py/1nQ/1X6//96sgNhE/nHilxCGiAucrG8gw+SeamgvksYTD4pvmxrKQAAAiNJREFUeJztlvdb2kAYx0MldZ6KgjhQcaDUwShBaa3WiVvR1r1oVeoe2EW1xbp31b/YS4AnkLtKXvnJ5+H7wyUkfD733uU4wjDxxBPPs4viRYKSZV8mJiWnpD5JkIbEpGdkKsAFoMiosrJhAjWSRpMDEmgJAUK5EEEeRZAPERRQBDqIoJAiKIIIiikCPUSgJPkSCM+UkoIyCJ9KGUE5RGCgCCoggkqKQA0RGCmCVwC+isJrIAVUUwQ1AL7WFIGaLVbcKgGC15F92zg7buvk8/WS4h3cG9y+lc1nNkgE7wRBo1y+ScrjIThwa5SHZyeS8/+e4yexuUUG3trWTvIdnFM4dkbFu7p7SLzXxln6hLOCx+n+gUENiVudLs4yFDgfplAfPuLUjozWjxmJqRMyPjFps4Y+TBElN9Kp/2VaMmEVMw6bHWSYDefnWLfbDcIRagoXfPrscrnmYQJWxBdYYOeBLIZ4T8MXs9k8Dx0CWgoJljs4PitQQYpAr2ZoYI9PzBrPr2+g8U0+1uiANFu8YNvuFernvHDBDuYVX73fnN/5wBaREPzf0voDjonRM8zPWHi8r3pi4fmfY34s/JiPYX7FwJfwC3nXFO1re7//+Pc71X8PDj1Hx81hN070wjI8fRQ+KT+M2HvPcs9VgVtKnS947cIU7OjyavlaFV7h+Xo/Zddj5jwG/82BT7ywu2/I0WmDL8//tLdbBv/Ozd09+G36ueYBouWWJdGhn1QAAAAASUVORK5CYII=";
      confettis.push(confetti_purple);
  
      confetti_green = new Image;
      confetti_green.src = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAbZQTFRFAAAAceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLZOFqZ9tbb+mGceuLZeJradpaaeV4ceuLceuLauV5Z+NzceuLceuLaeR4ceuLceuLZN1eceuLceuLceuLceuLceuLZuJuY+BmceuLceuLceuLceuLcOqKbuiFceuLceuLceuLaNtca+Z9ceuLceuLceuLceuLceuLceuLbeeBZ9pbYtxcceuLceuLceuLceuLceuLceuLZ+NvZeFqceuLceuLceuLaOR3ceuLceuLbOeBceuLceuLceuLceuLauZ8ceuLceuLY9xdceuLb+mGYd9hZOFnceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLk+XpDAAAAJJ0Uk5TAAxWns3i07qcbkokz//suW3wnRcj82I6QFR1b1iRNK0U1+uhZl1Bp9sNNaXcLPf////E////xYj//8D8/8uA//sIBnjp//8yEXzj//8ORpD//9kVHT9nr////0nItison///YBJH/zCr/zdXQ/L/WdD/Vfr//3qyA2ET+ceKXEIaIC5ysbyDD5J5qaC+SxhMPinVUeLwAAACJElEQVR4nGNgGAWjYBQMOcDIxMzCysrGzsHJxU2WATy8CMDHL8BIsgN4UYGgkDBpBojwogNRMZIMEMcwgJdXghQDJLEYIEWKAdJYDJAhxQBZLAbIkWKAPBYDFEgxgAVTvyIp+hmUMA1QJkU/NxYfqJBigCoWA9RIMUAdiwEipBiggcUATRL0a2HRL0qKA7SxGKBDgn5dPRSt+gaGQJKFBAOMUO02NjEFkmbE6zdHc7yFiSWQtCJav4A1mgE2YANsidVvh64f6AULIKlBnHZhdszwtzcBBaKDIxHanZxdMPW7mriBaXeC2j08vTC1exubGPiAWdL4dfv6+Ytiajd0CzAxCISwg7DoCg4BAt3QMPNwDYygA4OIyChjQxgnGsPJtth14QIxaAGmFmthbEqSCXHI+uNZvb29SdLOy2uHbEBCYkBAQBJpBrAitCezkmg5BKTA9Kdap+nr6yeR6gXedJgBGa4mIJBJqgFcYN1Z/KKkRR8CZIP05+TyRuSBgCFhDeggH2RAgWkh2P0mhaQbUATUz1hcWOJWCgKkJSIwANYtTmWka0MABQaGckr0A8vVVEr0g7KjFCX6wysYGCop0K8ISshVeoSUVdfU1tW7izQ0NqU2tzggSbQqgJNhG17NrSpNKGVvu0SHIESKRaYCKtapB7WoqzujRxDZhR05vlhKPYb4VNW63sYKhEBVvaqYjDi08dwn3p+vWlfUO2Eiya3poQoAMDyVfkKNVAQAAAAASUVORK5CYII=";
      confettis.push(confetti_green);
  
      confetti_yellow = new Image;
      confetti_yellow.src = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAbZQTFRFAAAAceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLZOFqZ9tbb+mGceuLZeJradpaaeV4ceuLceuLauV5Z+NzceuLceuLaeR4ceuLceuLZN1eceuLceuLceuLceuLceuLZuJuY+BmceuLceuLceuLceuLcOqKbuiFceuLceuLceuLaNtca+Z9ceuLceuLceuLceuLceuLceuLbeeBZ9pbYtxcceuLceuLceuLceuLceuLceuLZ+NvZeFqceuLceuLceuLaOR3ceuLceuLbOeBceuLceuLceuLceuLauZ8ceuLceuLY9xdceuLb+mGYd9hZOFnceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLceuLk+XpDAAAAJJ0Uk5TAAxWns3i07qcbkokz//suW3wnRcj82I6QFR1b1iRNK0U1+uhZl1Bp9sNNaXcLPf////E////xYj//8D8/8uA//sIBnjp//8yEXzj//8ORpD//9kVHT9nr////0nItison///YBJH/zCr/zdXQ/L/WdD/Vfr//3qyA2ET+ceKXEIaIC5ysbyDD5J5qaC+SxhMPinVUeLwAAACJElEQVR4nGNgGAWjYBQMOcDIxMzCysrGzsHJxU2WATy8CMDHL8BIsgN4UYGgkDBpBojwogNRMZIMEMcwgJdXghQDJLEYIEWKAdJYDJAhxQBZLAbIkWKAPBYDFEgxgAVTvyIp+hmUMA1QJkU/NxYfqJBigCoWA9RIMUAdiwEipBiggcUATRL0a2HRL0qKA7SxGKBDgn5dPRSt+gaGQJKFBAOMUO02NjEFkmbE6zdHc7yFiSWQtCJav4A1mgE2YANsidVvh64f6AULIKlBnHZhdszwtzcBBaKDIxHanZxdMPW7mriBaXeC2j08vTC1exubGPiAWdL4dfv6+Ytiajd0CzAxCISwg7DoCg4BAt3QMPNwDYygA4OIyChjQxgnGsPJtth14QIxaAGmFmthbEqSCXHI+uNZvb29SdLOy2uHbEBCYkBAQBJpBrAitCezkmg5BKTA9Kdap+nr6yeR6gXedJgBGa4mIJBJqgFcYN1Z/KKkRR8CZIP05+TyRuSBgCFhDeggH2RAgWkh2P0mhaQbUATUz1hcWOJWCgKkJSIwANYtTmWka0MABQaGckr0A8vVVEr0g7KjFCX6wysYGCop0K8ISshVeoSUVdfU1tW7izQ0NqU2tzggSbQqgJNhG17NrSpNKGVvu0SHIESKRaYCKtapB7WoqzujRxDZhR05vlhKPYb4VNW63sYKhEBVvaqYjDi08dwn3p+vWlfUO2Eiya3poQoAMDyVfkKNVAQAAAAASUVORK5CYII=";
      confettis.push(confetti_yellow);
  };
  
  
  
  /*
   * initializes a bunch of basic stuff
   * like canvas dimensions, 
   * default particle source, 
   * particle array...
   */
  var initCanvas = function() {
    var s = getComputedStyle(c);
    
    /* stop animation if any got started */
    if(req_id) {
      particles = [];
      cancelAnimationFrame(req_id);
      req_id = null;
      t = 0;
    }
    
    /* 
     * set canvas width & height
     * don't forget to also set the width & height attributes
     * of the canvas element, not just the w & h variables
     */
    w = c.width = ~~s.width.split('px')[0];
    h = c.height = ~~s.height.split('px')[0];
    
    /* set an inital source for particle fountain */
    source = { 'x': round(w/2), y: h };
    
    /* create particles and add them to the particle array */
    for(var i = 0; i < N_PARTICLES; i++) {
      particles.push(new Particle(i));
    }
    
    drawOnCanvas();
  };
  
  
  /*
   * goes through the particle array and
   * may call a particle's draw function
   */
  var drawOnCanvas = function() {
      ctx.clearRect ( 0 , 0 , w, h );
  
    
    /* go through each particle in the particle array */
    for(var i = 0; i < N_PARTICLES; i++) {
      if(particles[i].active) {// if it's active
        particles[i].draw(ctx); // draw it on canvas
      }
      else { // if not...
        particles[i].shoot(ctx); // try to make it shoot up
      }
    }
    
    t++; /* time increment */
    
    /**/
    req_id = requestAnimationFrame(drawOnCanvas);
    /**/
  };
  
  
  
  
  
  /*
   * =============================================
   * START IT ALL
   * =============================================
   */
  
  /* Pull in our confetti */
  loadConfetti();
  
  /* 
   * inside the setTimeout so that 
   * the dimensions do get set via CSS before calling 
   * the initCanvas function
   */
  setTimeout(function() {
    initCanvas();
    
    /* set new canvas dimensions on viewport resize */
    addEventListener('resize', initCanvas, false);
    
    c.addEventListener('mousemove', function(e) {
      ctx.clearRect(0, 0, w, h);
      
      /* move x coordinate of particle fountain source */
      source.x = e.clientX;
      source.y = e.clientY;
    }, false);
  }, 15);