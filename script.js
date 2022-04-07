/*

 Horizontal Scroll Slider

 Version: 0.0.1
 Author: Alexandre Buffet
 Website: https://www.alexandrebuffet.fr
*/
$(function(){
// Register GSAP plugins
gsap.registerPlugin(SplitText);
gsap.config({ trialWarn: false });

const ring = document.querySelector('.ring');

// replace spaces with &nbsp; element to make math easier (could also manually add these, if you )
const content = ring.textContent.replaceAll(/\s/g, "&nbsp;");
ring.innerHTML = content

// GSAP Split text into characters (could also just use a lot of spans, but this makes it easier) 
// using position: 'absolute' for positioning all to center
const ringText = new SplitText(ring, { type: "chars", position: 'absolute', });

// chars array
const chars = ringText.chars;

// circumference is width of text
const circumference = gsap.getProperty('.ring', 'width') ;

// get radius with math based on circumference c = 2πr
const radius = (circumference / Math.PI) / 2;

// set updating variables
let currentWidth = 0;

chars.forEach((char) => {
  // get width of current character to be used to get angle 
  const letterWidth = gsap.getProperty(char, 'width')
  const width = currentWidth;
  // Get rotation degrees based on current position on circle and knowledge of circumference (cross multiply and divide) 
  // really wish I knew why the * 1.135 is needed, but it prevents overlap. Determined by trial and error, sadly... 
  const rotation = ((width + (letterWidth / 2)) * 360 / (circumference * 1.1333) );
  
  // get letter height for transform origin   
  const letterHeight = gsap.getProperty(char, 'height');
  
  // set rotation and transform-origin based on above math. Set all letters to center.  
  gsap.set(char, {
    rotation: `${rotation}deg`, 
    transformOrigin: `center ${Math.ceil(radius + letterHeight)}px` ,
    xPercent: -50,
    left: '50%',
  });
  
  currentWidth += letterWidth;
})

// recenter circle
gsap.set(chars, {  y: -radius });
// make it visible to avoid FOUC
gsap.set(ring, { autoAlpha: 1});

// rotate at a rate of 50px per second (cross multiply and divide)
gsap.to(chars, { rotation: '-=360deg', duration: (circumference * 1.135) * 1 / 50 , ease: 'none', repeat: -1 })
})


!(function($) {

    'use strict';
  
    var $slider = $('.scroll-slider'),
        $slides = $('.scroll-slide'),
        $sliderWrapper = $('.scroll-wrapper'),
        $firstSlide = $slides.first();

    var settings = {},
        resizing = false,
        scrollController = null,
        scrollTween = null,
        scrollTimeline = null,
        progress = 0,
        scrollScene = null;

    function scrollSlider(options) {

        // Default
        settings = $.extend({
            slider: '.scroll-slider',
            sliderWrapper: '.scroll-wrapper',
            slides: '.scroll-slide',
            slideWidth: null,
            slideHeight: null,
        }, options);

        // Set dimensions
        setDimensions();
        
        // On resize        
        $(window).on( 'resize', function() {
          clearTimeout(resizing);
          resizing = setTimeout(function() {
            setDimensions();
          }, 250); 
        });
      
    }

    function setDimensions() {

        settings.slideWidth = $firstSlide.width();
        settings.slideHeight = $firstSlide.height();
      
        console.log(settings.slideWidth);
        console.log(settings.slideHeight);

        // Calculate slider width and height
        settings.sliderWidth = Math.ceil((settings.slideWidth * $slides.length));
        settings.sliderHeight = $firstSlide.outerHeight(true);

        // Set slider width and height
        $sliderWrapper.width(settings.sliderWidth);
        //$sliderWrapper.height(settings.sliderHeight);

        // Set scene
        setScene();

        //resizing = false;
    }

    function setScene() {

      var xDist = -$slides.width() * ( $slides.length - 1 ),
          tlParams = { x: xDist, ease: Power2.easeInOut };
              
      if (scrollScene != null && scrollTimeline != null) {
          
          progress = 0;
          scrollScene.progress(progress);

          scrollTimeline = new TimelineMax();
          scrollTimeline.to( $sliderWrapper, 2, tlParams );
        
          scrollScene.setTween(scrollTimeline);
        
          scrollScene.refresh();
        
      } else {
          // Init ScrollMagic controller
          scrollController = new ScrollMagic.Controller();

          //Create Tween
          scrollTimeline = new TimelineMax();
          scrollTimeline.to( $sliderWrapper, 2, tlParams );
          scrollTimeline.progress( progress );
        
          // Create scene to pin and link animation
          scrollScene = new ScrollMagic.Scene({
              triggerElement: settings.slider,
              triggerHook: "onLeave",
              duration: settings.sliderWidth
          })
          .setPin(settings.slider)
          .setTween(scrollTimeline)
          .addTo(scrollController)
          .on('start', function (event) {
            scrollTimeline.time(0);
          });
      }
        
    }
    
  $(document).ready(function() {
    scrollSlider(); 
  });
    
})(jQuery);