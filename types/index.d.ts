declare global {
  /**
   * Forked from `https://github.com/adamhaile/surplus` and adapted for `babel-plugin-jsx-dom-expressions`.
   *
   * @see https://github.com/adamhaile/surplus/blob/master/index.d.ts
   * @see https://github.com/ryansolid/babel-plugin-jsx-dom-expressions
   */

  namespace JSX {
    type Element =
      | Node
      | ArrayElement
      | FunctionElement
      | string
      | number
      | boolean
      | undefined
      | unknown;

    interface ArrayElement extends Array<Element> {}
    interface FunctionElement {
      (): Element;
    }

    // Let TS know the name of the `children` property in order for it to be able to type check them.
    // https://github.com/Microsoft/TypeScript/issues/18357
    interface ElementChildrenAttribute {
      children: {};
    }

    type Child = Element | string | number | boolean | null | undefined;
    type Children =
      | Child
      | Child[]
      | (Child | Child[])[]
      | (() => Child)
      | (() => Child[]);

    interface EventHandler<T, E extends Event> {
      (e: E & { currentTarget: T, target: T }): void;
    }

    // Intrinsic attributes enable us to define certain keys as attributes on an element, while
    // at the same time hiding them from the element's `props`.
    // https://github.com/Microsoft/TypeScript/issues/5478
    interface IntrinsicAttributes {
      ref?: HTMLElement;
      forwardRef?: (e: HTMLElement) => void;
    }

    // https://github.com/ryansolid/babel-plugin-jsx-dom-expressions#special-binding
    interface CustomAttributes<T> {
      ref?: T | ((el: T) => void);
      forwardRef?: (el: T) => void;
      classList?: { [k: string]: boolean | undefined };
      events?: { [key: string]: EventHandler<T, CustomEvent> };
    }

    // Lowercase events are considered directly bound events, while camelCased events are delegated.
    // https://github.com/ryansolid/babel-plugin-jsx-dom-expressions#oneventname--model
    interface DOMAttributes<T> extends CustomAttributes<T> {
      children?: Children;
      innerHTML?: string;

      // Clipboard Events
      onCopy?: EventHandler<T, ClipboardEvent>;
      oncopy?: EventHandler<T, ClipboardEvent>;
      onCopyCapture?: EventHandler<T, ClipboardEvent>;
      oncopycapture?: EventHandler<T, ClipboardEvent>;
      onCut?: EventHandler<T, ClipboardEvent>;
      oncut?: EventHandler<T, ClipboardEvent>;
      onCutCapture?: EventHandler<T, ClipboardEvent>;
      oncutcapture?: EventHandler<T, ClipboardEvent>;
      onPaste?: EventHandler<T, ClipboardEvent>;
      onpaste?: EventHandler<T, ClipboardEvent>;
      onPasteCapture?: EventHandler<T, ClipboardEvent>;
      onpastecapture?: EventHandler<T, ClipboardEvent>;

      // Composition Events
      onCompositionEnd?: EventHandler<T, CompositionEvent>;
      oncompositionend?: EventHandler<T, CompositionEvent>;
      onCompositionEndCapture?: EventHandler<T, CompositionEvent>;
      oncompositionendcapture?: EventHandler<T, CompositionEvent>;
      onCompositionStart?: EventHandler<T, CompositionEvent>;
      oncompositionstart?: EventHandler<T, CompositionEvent>;
      onCompositionStartCapture?: EventHandler<T, CompositionEvent>;
      oncompositionstartcapture?: EventHandler<T, CompositionEvent>;
      onCompositionUpdate?: EventHandler<T, CompositionEvent>;
      oncompositionupdate?: EventHandler<T, CompositionEvent>;
      onCompositionUpdateCapture?: EventHandler<T, CompositionEvent>;
      oncompositionupdatecapture?: EventHandler<T, CompositionEvent>;

      // Focus Events
      onFocus?: EventHandler<T, FocusEvent>;
      onfocus?: EventHandler<T, FocusEvent>;
      onFocusCapture?: EventHandler<T, FocusEvent>;
      onfocuscapture?: EventHandler<T, FocusEvent>;
      onBlur?: EventHandler<T, FocusEvent>;
      onblur?: EventHandler<T, FocusEvent>;
      onBlurCapture?: EventHandler<T, FocusEvent>;
      onblurcapture?: EventHandler<T, FocusEvent>;

      // Form Events
      onChange?: EventHandler<T, Event>;
      onchange?: EventHandler<T, Event>;
      onChangeCapture?: EventHandler<T, Event>;
      onchangecapture?: EventHandler<T, Event>;
      onInput?: EventHandler<T, Event>;
      oninput?: EventHandler<T, Event>;
      onInputCapture?: EventHandler<T, Event>;
      oninputcapture?: EventHandler<T, Event>;
      onReset?: EventHandler<T, Event>;
      onreset?: EventHandler<T, Event>;
      onResetCapture?: EventHandler<T, Event>;
      onresetcapture?: EventHandler<T, Event>;
      onSubmit?: EventHandler<T, Event>;
      onsubmit?: EventHandler<T, Event>;
      onSubmitCapture?: EventHandler<T, Event>;
      onsubmitcapture?: EventHandler<T, Event>;

      // Image Events
      onLoad?: EventHandler<T, Event>;
      onload?: EventHandler<T, Event>;
      onLoadCapture?: EventHandler<T, Event>;
      onloadcapture?: EventHandler<T, Event>;
      onError?: EventHandler<T, Event>; // also a Media Event
      onerror?: EventHandler<T, Event>; // also a Media Event
      onErrorCapture?: EventHandler<T, Event>; // also a Media Event
      onerrorcapture?: EventHandler<T, Event>; // also a Media Event

      // Keyboard Events
      onKeyDown?: EventHandler<T, KeyboardEvent>;
      onkeydown?: EventHandler<T, KeyboardEvent>;
      onKeyDownCapture?: EventHandler<T, KeyboardEvent>;
      onkeydowncapture?: EventHandler<T, KeyboardEvent>;
      onKeyPress?: EventHandler<T, KeyboardEvent>;
      onkeypress?: EventHandler<T, KeyboardEvent>;
      onKeyPressCapture?: EventHandler<T, KeyboardEvent>;
      onkeypresscapture?: EventHandler<T, KeyboardEvent>;
      onKeyUp?: EventHandler<T, KeyboardEvent>;
      onkeyup?: EventHandler<T, KeyboardEvent>;
      onKeyUpCapture?: EventHandler<T, KeyboardEvent>;
      onkeyupcapture?: EventHandler<T, KeyboardEvent>;

      // Pointer Events
      onGotPointerCapture?: EventHandler<T, Event>;
      ongotpointercapture?: EventHandler<T, Event>;
      onLostPointerCapture?: EventHandler<T, Event>;
      onlostpointercapture?: EventHandler<T, Event>;
      onPointerCancel?: EventHandler<T, Event>;
      onpointercancel?: EventHandler<T, Event>;
      onPointerDown?: EventHandler<T, Event>;
      onpointerdown?: EventHandler<T, Event>;
      onPointerEnter?: EventHandler<T, Event>;
      onpointerenter?: EventHandler<T, Event>;
      onPointerLeave?: EventHandler<T, Event>;
      onpointerleave?: EventHandler<T, Event>;
      onPointerMove?: EventHandler<T, Event>;
      onpointermove?: EventHandler<T, Event>;
      onPointerOver?: EventHandler<T, Event>;
      onpointerover?: EventHandler<T, Event>;
      onPointerOut?: EventHandler<T, Event>;
      onpointerout?: EventHandler<T, Event>;
      onPointerUp?: EventHandler<T, Event>;
      onpointerup?: EventHandler<T, Event>;

      // Media Events
      onAbort?: EventHandler<T, Event>;
      onabort?: EventHandler<T, Event>;
      onAbortCapture?: EventHandler<T, Event>;
      onabortcapture?: EventHandler<T, Event>;
      onCanPlay?: EventHandler<T, Event>;
      oncanplay?: EventHandler<T, Event>;
      onCanPlayCapture?: EventHandler<T, Event>;
      oncanplaycapture?: EventHandler<T, Event>;
      onCanPlayThrough?: EventHandler<T, Event>;
      oncanplaythrough?: EventHandler<T, Event>;
      onCanPlayThroughCapture?: EventHandler<T, Event>;
      oncanplaythroughcapture?: EventHandler<T, Event>;
      onDurationChange?: EventHandler<T, Event>;
      ondurationchange?: EventHandler<T, Event>;
      onDurationChangeCapture?: EventHandler<T, Event>;
      ondurationchangecapture?: EventHandler<T, Event>;
      onEmptied?: EventHandler<T, Event>;
      onemptied?: EventHandler<T, Event>;
      onEmptiedCapture?: EventHandler<T, Event>;
      onemptiedcapture?: EventHandler<T, Event>;
      onEncrypted?: EventHandler<T, Event>;
      onencrypted?: EventHandler<T, Event>;
      onEncryptedCapture?: EventHandler<T, Event>;
      onencryptedcapture?: EventHandler<T, Event>;
      onEnded?: EventHandler<T, Event>;
      onended?: EventHandler<T, Event>;
      onEndedCapture?: EventHandler<T, Event>;
      onendedcapture?: EventHandler<T, Event>;
      onLoadedData?: EventHandler<T, Event>;
      onloadeddata?: EventHandler<T, Event>;
      onLoadedDataCapture?: EventHandler<T, Event>;
      onloadeddatacapture?: EventHandler<T, Event>;
      onLoadedMetadata?: EventHandler<T, Event>;
      onloadedmetadata?: EventHandler<T, Event>;
      onLoadedMetadataCapture?: EventHandler<T, Event>;
      onloadedmetadatacapture?: EventHandler<T, Event>;
      onLoadStart?: EventHandler<T, Event>;
      onloadstart?: EventHandler<T, Event>;
      onLoadStartCapture?: EventHandler<T, Event>;
      onloadstartcapture?: EventHandler<T, Event>;
      onPause?: EventHandler<T, Event>;
      onpause?: EventHandler<T, Event>;
      onPauseCapture?: EventHandler<T, Event>;
      onpausecapture?: EventHandler<T, Event>;
      onPlay?: EventHandler<T, Event>;
      onplay?: EventHandler<T, Event>;
      onPlayCapture?: EventHandler<T, Event>;
      onplaycapture?: EventHandler<T, Event>;
      onPlaying?: EventHandler<T, Event>;
      onplaying?: EventHandler<T, Event>;
      onPlayingCapture?: EventHandler<T, Event>;
      onplayingcapture?: EventHandler<T, Event>;
      onProgress?: EventHandler<T, Event>;
      onprogress?: EventHandler<T, Event>;
      onProgressCapture?: EventHandler<T, Event>;
      onprogresscapture?: EventHandler<T, Event>;
      onRateChange?: EventHandler<T, Event>;
      onratechange?: EventHandler<T, Event>;
      onRateChangeCapture?: EventHandler<T, Event>;
      onratechangecapture?: EventHandler<T, Event>;
      onSeeked?: EventHandler<T, Event>;
      onseeked?: EventHandler<T, Event>;
      onSeekedCapture?: EventHandler<T, Event>;
      onseekedcapture?: EventHandler<T, Event>;
      onSeeking?: EventHandler<T, Event>;
      onseeking?: EventHandler<T, Event>;
      onSeekingCapture?: EventHandler<T, Event>;
      onseekingcapture?: EventHandler<T, Event>;
      onStalled?: EventHandler<T, Event>;
      onstalled?: EventHandler<T, Event>;
      onStalledCapture?: EventHandler<T, Event>;
      onstalledcapture?: EventHandler<T, Event>;
      onSuspend?: EventHandler<T, Event>;
      onsuspend?: EventHandler<T, Event>;
      onSuspendCapture?: EventHandler<T, Event>;
      onsuspendcapture?: EventHandler<T, Event>;
      onTimeUpdate?: EventHandler<T, Event>;
      ontimeupdate?: EventHandler<T, Event>;
      onTimeUpdateCapture?: EventHandler<T, Event>;
      ontimeupdatecapture?: EventHandler<T, Event>;
      onVolumeChange?: EventHandler<T, Event>;
      onvolumechange?: EventHandler<T, Event>;
      onVolumeChangeCapture?: EventHandler<T, Event>;
      onvolumechangecapture?: EventHandler<T, Event>;
      onWaiting?: EventHandler<T, Event>;
      onwaiting?: EventHandler<T, Event>;
      onWaitingCapture?: EventHandler<T, Event>;
      onwaitingcapture?: EventHandler<T, Event>;

      // MouseEvents
      onClick?: EventHandler<T, MouseEvent>;
      onclick?: EventHandler<T, MouseEvent>;
      onClickCapture?: EventHandler<T, MouseEvent>;
      onclickcapture?: EventHandler<T, MouseEvent>;
      onContextMenu?: EventHandler<T, MouseEvent>;
      oncontextmenu?: EventHandler<T, MouseEvent>;
      onContextMenuCapture?: EventHandler<T, MouseEvent>;
      oncontextmenucapture?: EventHandler<T, MouseEvent>;
      onDoubleClick?: EventHandler<T, MouseEvent>;
      ondoubleclick?: EventHandler<T, MouseEvent>;
      onDoubleClickCapture?: EventHandler<T, MouseEvent>;
      ondoubleclickcapture?: EventHandler<T, MouseEvent>;
      onDrag?: EventHandler<T, DragEvent>;
      ondrag?: EventHandler<T, DragEvent>;
      onDragCapture?: EventHandler<T, DragEvent>;
      ondragcapture?: EventHandler<T, DragEvent>;
      onDragEnd?: EventHandler<T, DragEvent>;
      ondragend?: EventHandler<T, DragEvent>;
      onDragEndCapture?: EventHandler<T, DragEvent>;
      ondragendcapture?: EventHandler<T, DragEvent>;
      onDragEnter?: EventHandler<T, DragEvent>;
      ondragenter?: EventHandler<T, DragEvent>;
      onDragEnterCapture?: EventHandler<T, DragEvent>;
      ondragentercapture?: EventHandler<T, DragEvent>;
      onDragExit?: EventHandler<T, DragEvent>;
      ondragexit?: EventHandler<T, DragEvent>;
      onDragExitCapture?: EventHandler<T, DragEvent>;
      ondragexitcapture?: EventHandler<T, DragEvent>;
      onDragLeave?: EventHandler<T, DragEvent>;
      ondragleave?: EventHandler<T, DragEvent>;
      onDragLeaveCapture?: EventHandler<T, DragEvent>;
      ondragleavecapture?: EventHandler<T, DragEvent>;
      onDragOver?: EventHandler<T, DragEvent>;
      ondragover?: EventHandler<T, DragEvent>;
      onDragOverCapture?: EventHandler<T, DragEvent>;
      ondragovercapture?: EventHandler<T, DragEvent>;
      onDragStart?: EventHandler<T, DragEvent>;
      ondragstart?: EventHandler<T, DragEvent>;
      onDragStartCapture?: EventHandler<T, DragEvent>;
      ondragstartcapture?: EventHandler<T, DragEvent>;
      onDrop?: EventHandler<T, DragEvent>;
      ondrop?: EventHandler<T, DragEvent>;
      onDropCapture?: EventHandler<T, DragEvent>;
      ondropcapture?: EventHandler<T, DragEvent>;
      onMouseDown?: EventHandler<T, MouseEvent>;
      onmousedown?: EventHandler<T, MouseEvent>;
      onMouseDownCapture?: EventHandler<T, MouseEvent>;
      onmousedowncapture?: EventHandler<T, MouseEvent>;
      onMouseEnter?: EventHandler<T, MouseEvent>;
      onmouseenter?: EventHandler<T, MouseEvent>;
      onMouseLeave?: EventHandler<T, MouseEvent>;
      onmouseleave?: EventHandler<T, MouseEvent>;
      onMouseMove?: EventHandler<T, MouseEvent>;
      onmousemove?: EventHandler<T, MouseEvent>;
      onMouseMoveCapture?: EventHandler<T, MouseEvent>;
      onmousemovecapture?: EventHandler<T, MouseEvent>;
      onMouseOut?: EventHandler<T, MouseEvent>;
      onmouseout?: EventHandler<T, MouseEvent>;
      onMouseOutCapture?: EventHandler<T, MouseEvent>;
      onmouseoutcapture?: EventHandler<T, MouseEvent>;
      onMouseOver?: EventHandler<T, MouseEvent>;
      onmouseover?: EventHandler<T, MouseEvent>;
      onMouseOverCapture?: EventHandler<T, MouseEvent>;
      onmouseovercapture?: EventHandler<T, MouseEvent>;
      onMouseUp?: EventHandler<T, MouseEvent>;
      onmouseup?: EventHandler<T, MouseEvent>;
      onMouseUpCapture?: EventHandler<T, MouseEvent>;
      onmouseupcapture?: EventHandler<T, MouseEvent>;

      // Selection Events
      onSelect?: EventHandler<T, Event>;
      onselect?: EventHandler<T, Event>;
      onSelectCapture?: EventHandler<T, Event>;
      onselectcapture?: EventHandler<T, Event>;

      // Touch Events
      onTouchCancel?: EventHandler<T, TouchEvent>;
      ontouchcancel?: EventHandler<T, TouchEvent>;
      onTouchCancelCapture?: EventHandler<T, TouchEvent>;
      ontouchcancelcapture?: EventHandler<T, TouchEvent>;
      onTouchEnd?: EventHandler<T, TouchEvent>;
      ontouchend?: EventHandler<T, TouchEvent>;
      onTouchEndCapture?: EventHandler<T, TouchEvent>;
      ontouchendcapture?: EventHandler<T, TouchEvent>;
      onTouchMove?: EventHandler<T, TouchEvent>;
      ontouchmove?: EventHandler<T, TouchEvent>;
      onTouchMoveCapture?: EventHandler<T, TouchEvent>;
      ontouchmovecapture?: EventHandler<T, TouchEvent>;
      onTouchStart?: EventHandler<T, TouchEvent>;
      ontouchstart?: EventHandler<T, TouchEvent>;
      onTouchStartCapture?: EventHandler<T, TouchEvent>;
      ontouchstartcapture?: EventHandler<T, TouchEvent>;

      // UI Events
      onScroll?: EventHandler<T, UIEvent>;
      onscroll?: EventHandler<T, UIEvent>;
      onScrollCapture?: EventHandler<T, UIEvent>;
      onscrollcapture?: EventHandler<T, UIEvent>;

      // Wheel Events
      onWheel?: EventHandler<T, WheelEvent>;
      onwheel?: EventHandler<T, WheelEvent>;
      onWheelCapture?: EventHandler<T, WheelEvent>;
      onwheelcapture?: EventHandler<T, WheelEvent>;

      // Animation Events
      onAnimationStart?: EventHandler<T, AnimationEvent>;
      onanimationstart?: EventHandler<T, AnimationEvent>;
      onAnimationStartCapture?: EventHandler<T, AnimationEvent>;
      onanimationstartcapture?: EventHandler<T, AnimationEvent>;
      onAnimationEnd?: EventHandler<T, AnimationEvent>;
      onanimationend?: EventHandler<T, AnimationEvent>;
      onAnimationEndCapture?: EventHandler<T, AnimationEvent>;
      onanimationendcapture?: EventHandler<T, AnimationEvent>;
      onAnimationIteration?: EventHandler<T, AnimationEvent>;
      onanimationiteration?: EventHandler<T, AnimationEvent>;
      onAnimationIterationCapture?: EventHandler<T, AnimationEvent>;
      onanimationiterationcapture?: EventHandler<T, AnimationEvent>;

      // Transition Events
      onTransitionEnd?: EventHandler<T, TransitionEvent>;
      ontransitionend?: EventHandler<T, TransitionEvent>;
      onTransitionEndCapture?: EventHandler<T, TransitionEvent>;
      ontransitionendcapture?: EventHandler<T, TransitionEvent>;
    }

    interface HTMLAttributes<T> extends DOMAttributes<T> {
      // Standard HTML Attributes
      accept?: string;
      acceptCharset?: string;
      accessKey?: string;
      action?: string;
      allowFullScreen?: boolean;
      allowFullscreen?: boolean;
      allowTransparency?: boolean;
      alt?: string;
      async?: boolean;
      autocomplete?: string;
      autoFocus?: boolean;
      autofocus?: boolean;
      autoPlay?: boolean;
      autoplay?: boolean;
      capture?: boolean;
      cellpadding?: number | string;
      cellspacing?: number | string;
      charSet?: string;
      challenge?: string;
      checked?: boolean;
      classID?: string;
      className?: string;
      class?: string;
      cols?: number | string;
      colSpan?: number | string;
      content?: string;
      contenteditable?: boolean;
      contextmenu?: string;
      controls?: boolean;
      coords?: string;
      crossorigin?: string;
      data?: string;
      dataset?: string;
      dateTime?: string;
      default?: boolean;
      defer?: boolean;
      dir?: string;
      disabled?: boolean;
      download?: any;
      draggable?: boolean;
      enctype?: string;
      form?: string;
      formAction?: string;
      formEncType?: string;
      formMethod?: string;
      formNoValidate?: boolean;
      formTarget?: string;
      frameBorder?: number | string;
      headers?: string;
      height?: number | string;
      hidden?: boolean;
      high?: number | string;
      href?: string;
      hreflang?: string;
      htmlFor?: string;
      for?: string;
      httpEquiv?: string;
      id?: string;
      innerText?: string | number;
      inputmode?: string;
      integrity?: string;
      is?: string;
      keytype?: string;
      kind?: string;
      label?: string;
      lang?: string;
      list?: string;
      loop?: boolean;
      low?: number | string;
      manifest?: string;
      marginheight?: number | string;
      marginwidth?: number | string;
      max?: number | string;
      maxLength?: number | string;
      media?: string;
      mediaGroup?: string;
      method?: string;
      min?: number | string;
      minLength?: number | string;
      multiple?: boolean;
      muted?: boolean;
      name?: string;
      nonce?: string;
      novalidate?: boolean;
      open?: boolean;
      optimum?: number | string;
      pattern?: string;
      placeholder?: string;
      playsinline?: boolean;
      poster?: string;
      preload?: string;
      radiogroup?: string;
      readonly?: boolean;
      rel?: string;
      required?: boolean;
      reversed?: boolean;
      role?: string;
      rows?: number | string;
      rowspan?: number | string;
      sandbox?: string;
      scope?: string;
      scoped?: boolean;
      scrolling?: string;
      seamless?: boolean;
      selected?: boolean;
      shape?: string;
      size?: number | string;
      sizes?: string;
      span?: number | string;
      spellCheck?: boolean;
      spellcheck?: boolean;
      src?: string;
      srcdoc?: string;
      srclang?: string;
      srcset?: string;
      start?: number | string;
      step?: number | string;
      style?: Partial<CSSStyleDeclaration>;
      summary?: string;
      tabindex?: number | string;
      target?: string;
      title?: string;
      type?: string;
      useMap?: string;
      value?: string | string[] | number;
      width?: number | string;
      wmode?: string;
      wrap?: string;

      // RDFa Attributes
      about?: string;
      datatype?: string;
      inlist?: any;
      prefix?: string;
      property?: string;
      resource?: string;
      typeof?: string;
      vocab?: string;

      // Non-standard Attributes
      autoCapitalize?: string;
      autocapitalize?: string;
      autocorrect?: string;
      autosave?: string;
      color?: string;
      itemprop?: string;
      itemscope?: boolean;
      itemtype?: string;
      itemid?: string;
      itemref?: string;
      results?: number | string;
      security?: string;
      unselectable?: boolean;
    }

    interface SVGAttributes<T> extends HTMLAttributes<T> {
      accentHeight?: number | string;
      accumulate?: "none" | "sum";
      additive?: "replace" | "sum";
      alignmentBaseline?:
        | "auto"
        | "baseline"
        | "before-edge"
        | "text-before-edge"
        | "middle"
        | "central"
        | "after-edge"
        | "text-after-edge"
        | "ideographic"
        | "alphabetic"
        | "hanging"
        | "mathematical"
        | "inherit";
      allowReorder?: "no" | "yes";
      alphabetic?: number | string;
      amplitude?: number | string;
      arabicForm?: "initial" | "medial" | "terminal" | "isolated";
      ascent?: number | string;
      attributeName?: string;
      attributeType?: string;
      autoReverse?: number | string;
      azimuth?: number | string;
      baseFrequency?: number | string;
      baselineShift?: number | string;
      baseProfile?: number | string;
      bbox?: number | string;
      begin?: number | string;
      bias?: number | string;
      by?: number | string;
      calcMode?: number | string;
      capHeight?: number | string;
      clip?: number | string;
      clipPath?: string;
      clipPathUnits?: number | string;
      clipRule?: number | string;
      colorInterpolation?: number | string;
      colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit";
      colorProfile?: number | string;
      colorRendering?: number | string;
      contentScriptType?: number | string;
      contentStyleType?: number | string;
      cursor?: number | string;
      cx?: number | string;
      cy?: number | string;
      d?: string;
      decelerate?: number | string;
      descent?: number | string;
      diffuseConstant?: number | string;
      direction?: number | string;
      display?: number | string;
      divisor?: number | string;
      dominantBaseline?: number | string;
      dur?: number | string;
      dx?: number | string;
      dy?: number | string;
      edgeMode?: number | string;
      elevation?: number | string;
      enableBackground?: number | string;
      end?: number | string;
      exponent?: number | string;
      externalResourcesRequired?: number | string;
      fill?: string;
      fillOpacity?: number | string;
      fillRule?: "nonzero" | "evenodd" | "inherit";
      filter?: string;
      filterRes?: number | string;
      filterUnits?: number | string;
      floodColor?: number | string;
      floodOpacity?: number | string;
      focusable?: number | string;
      fontFamily?: string;
      fontSize?: number | string;
      fontSizeAdjust?: number | string;
      fontStretch?: number | string;
      fontStyle?: number | string;
      fontVariant?: number | string;
      fontWeight?: number | string;
      format?: number | string;
      from?: number | string;
      fx?: number | string;
      fy?: number | string;
      g1?: number | string;
      g2?: number | string;
      glyphName?: number | string;
      glyphOrientationHorizontal?: number | string;
      glyphOrientationVertical?: number | string;
      glyphRef?: number | string;
      gradientTransform?: string;
      gradientUnits?: string;
      hanging?: number | string;
      horizAdvX?: number | string;
      horizOriginX?: number | string;
      ideographic?: number | string;
      imageRendering?: number | string;
      in2?: number | string;
      in?: string;
      intercept?: number | string;
      k1?: number | string;
      k2?: number | string;
      k3?: number | string;
      k4?: number | string;
      k?: number | string;
      kernelMatrix?: number | string;
      kernelUnitLength?: number | string;
      kerning?: number | string;
      keyPoints?: number | string;
      keySplines?: number | string;
      keyTimes?: number | string;
      lengthAdjust?: number | string;
      letterSpacing?: number | string;
      lightingColor?: number | string;
      limitingConeAngle?: number | string;
      local?: number | string;
      markerEnd?: string;
      markerHeight?: number | string;
      markerMid?: string;
      markerStart?: string;
      markerUnits?: number | string;
      markerWidth?: number | string;
      mask?: string;
      maskContentUnits?: number | string;
      maskUnits?: number | string;
      mathematical?: number | string;
      mode?: number | string;
      numOctaves?: number | string;
      offset?: number | string;
      opacity?: number | string;
      operator?: number | string;
      order?: number | string;
      orient?: number | string;
      orientation?: number | string;
      origin?: number | string;
      overflow?: number | string;
      overlinePosition?: number | string;
      overlineThickness?: number | string;
      paintOrder?: number | string;
      panose1?: number | string;
      pathLength?: number | string;
      patternContentUnits?: string;
      patternTransform?: number | string;
      patternUnits?: string;
      pointerEvents?: number | string;
      points?: string;
      pointsAtX?: number | string;
      pointsAtY?: number | string;
      pointsAtZ?: number | string;
      preserveAlpha?: number | string;
      preserveAspectRatio?: string;
      primitiveUnits?: number | string;
      r?: number | string;
      radius?: number | string;
      refX?: number | string;
      refY?: number | string;
      renderingIntent?: number | string;
      repeatCount?: number | string;
      repeatDur?: number | string;
      requiredExtensions?: number | string;
      requiredFeatures?: number | string;
      restart?: number | string;
      result?: string;
      rotate?: number | string;
      rx?: number | string;
      ry?: number | string;
      scale?: number | string;
      seed?: number | string;
      shapeRendering?: number | string;
      slope?: number | string;
      spacing?: number | string;
      specularConstant?: number | string;
      specularExponent?: number | string;
      speed?: number | string;
      spreadMethod?: string;
      startOffset?: number | string;
      stdDeviation?: number | string;
      stemh?: number | string;
      stemv?: number | string;
      stitchTiles?: number | string;
      stopColor?: string;
      stopOpacity?: number | string;
      strikethroughPosition?: number | string;
      strikethroughThickness?: number | string;
      string?: number | string;
      stroke?: string;
      strokeDasharray?: string | number;
      strokeDashoffset?: string | number;
      strokeLinecap?: "butt" | "round" | "square" | "inherit";
      strokeLinejoin?: "miter" | "round" | "bevel" | "inherit";
      strokeMiterlimit?: number | string;
      strokeOpacity?: number | string;
      strokeWidth?: number | string;
      surfaceScale?: number | string;
      systemLanguage?: number | string;
      tableValues?: number | string;
      targetX?: number | string;
      targetY?: number | string;
      textAnchor?: string;
      textDecoration?: number | string;
      textLength?: number | string;
      textRendering?: number | string;
      to?: number | string;
      transform?: string;
      u1?: number | string;
      u2?: number | string;
      underlinePosition?: number | string;
      underlineThickness?: number | string;
      unicode?: number | string;
      unicodeBidi?: number | string;
      unicodeRange?: number | string;
      unitsPerEm?: number | string;
      vAlphabetic?: number | string;
      values?: string;
      vectorEffect?: number | string;
      version?: string;
      vertAdvY?: number | string;
      vertOriginX?: number | string;
      vertOriginY?: number | string;
      vHanging?: number | string;
      vIdeographic?: number | string;
      viewBox?: string;
      viewTarget?: number | string;
      visibility?: number | string;
      vMathematical?: number | string;
      widths?: number | string;
      wordSpacing?: number | string;
      writingMode?: number | string;
      x1?: number | string;
      x2?: number | string;
      x?: number | string;
      xChannelSelector?: string;
      xHeight?: number | string;
      xlinkActuate?: string;
      xlinkArcrole?: string;
      xlinkHref?: string;
      xlinkRole?: string;
      xlinkShow?: string;
      xlinkTitle?: string;
      xlinkType?: string;
      xmlBase?: string;
      xmlLang?: string;
      xmlns?: string;
      xmlnsXlink?: string;
      xmlSpace?: string;
      y1?: number | string;
      y2?: number | string;
      y?: number | string;
      yChannelSelector?: string;
      z?: number | string;
      zoomAndPan?: string;
    }

    interface IntrinsicElements {
      // HTML
      a: HTMLAttributes<HTMLAnchorElement>;
      abbr: HTMLAttributes<HTMLElement>;
      address: HTMLAttributes<HTMLElement>;
      area: HTMLAttributes<HTMLAreaElement>;
      article: HTMLAttributes<HTMLElement>;
      aside: HTMLAttributes<HTMLElement>;
      audio: HTMLAttributes<HTMLAudioElement>;
      b: HTMLAttributes<HTMLElement>;
      base: HTMLAttributes<HTMLBaseElement>;
      bdi: HTMLAttributes<HTMLElement>;
      bdo: HTMLAttributes<HTMLElement>;
      big: HTMLAttributes<HTMLElement>;
      blockquote: HTMLAttributes<HTMLElement>;
      body: HTMLAttributes<HTMLBodyElement>;
      br: HTMLAttributes<HTMLBRElement>;
      button: HTMLAttributes<HTMLButtonElement>;
      canvas: HTMLAttributes<HTMLCanvasElement>;
      caption: HTMLAttributes<HTMLElement>;
      cite: HTMLAttributes<HTMLElement>;
      code: HTMLAttributes<HTMLElement>;
      col: HTMLAttributes<HTMLTableColElement>;
      colgroup: HTMLAttributes<HTMLTableColElement>;
      data: HTMLAttributes<HTMLElement>;
      datalist: HTMLAttributes<HTMLDataListElement>;
      dd: HTMLAttributes<HTMLElement>;
      del: HTMLAttributes<HTMLElement>;
      details: HTMLAttributes<HTMLElement>;
      dfn: HTMLAttributes<HTMLElement>;
      dialog: HTMLAttributes<HTMLElement>;
      div: HTMLAttributes<HTMLDivElement>;
      dl: HTMLAttributes<HTMLDListElement>;
      dt: HTMLAttributes<HTMLElement>;
      em: HTMLAttributes<HTMLElement>;
      embed: HTMLAttributes<HTMLEmbedElement>;
      fieldset: HTMLAttributes<HTMLFieldSetElement>;
      figcaption: HTMLAttributes<HTMLElement>;
      figure: HTMLAttributes<HTMLElement>;
      footer: HTMLAttributes<HTMLElement>;
      form: HTMLAttributes<HTMLFormElement>;
      h1: HTMLAttributes<HTMLHeadingElement>;
      h2: HTMLAttributes<HTMLHeadingElement>;
      h3: HTMLAttributes<HTMLHeadingElement>;
      h4: HTMLAttributes<HTMLHeadingElement>;
      h5: HTMLAttributes<HTMLHeadingElement>;
      h6: HTMLAttributes<HTMLHeadingElement>;
      head: HTMLAttributes<HTMLHeadElement>;
      header: HTMLAttributes<HTMLElement>;
      hgroup: HTMLAttributes<HTMLElement>;
      hr: HTMLAttributes<HTMLHRElement>;
      html: HTMLAttributes<HTMLHtmlElement>;
      i: HTMLAttributes<HTMLElement>;
      iframe: HTMLAttributes<HTMLIFrameElement>;
      img: HTMLAttributes<HTMLImageElement>;
      input: HTMLAttributes<HTMLInputElement>;
      ins: HTMLAttributes<HTMLModElement>;
      kbd: HTMLAttributes<HTMLElement>;
      keygen: HTMLAttributes<HTMLElement>;
      label: HTMLAttributes<HTMLLabelElement>;
      legend: HTMLAttributes<HTMLLegendElement>;
      li: HTMLAttributes<HTMLLIElement>;
      link: HTMLAttributes<HTMLLinkElement>;
      main: HTMLAttributes<HTMLElement>;
      map: HTMLAttributes<HTMLMapElement>;
      mark: HTMLAttributes<HTMLElement>;
      menu: HTMLAttributes<HTMLElement>;
      menuitem: HTMLAttributes<HTMLElement>;
      meta: HTMLAttributes<HTMLMetaElement>;
      meter: HTMLAttributes<HTMLElement>;
      nav: HTMLAttributes<HTMLElement>;
      noindex: HTMLAttributes<HTMLElement>;
      noscript: HTMLAttributes<HTMLElement>;
      object: HTMLAttributes<HTMLObjectElement>;
      ol: HTMLAttributes<HTMLOListElement>;
      optgroup: HTMLAttributes<HTMLOptGroupElement>;
      option: HTMLAttributes<HTMLOptionElement>;
      output: HTMLAttributes<HTMLElement>;
      p: HTMLAttributes<HTMLParagraphElement>;
      param: HTMLAttributes<HTMLParamElement>;
      picture: HTMLAttributes<HTMLElement>;
      pre: HTMLAttributes<HTMLPreElement>;
      progress: HTMLAttributes<HTMLProgressElement>;
      q: HTMLAttributes<HTMLQuoteElement>;
      rp: HTMLAttributes<HTMLElement>;
      rt: HTMLAttributes<HTMLElement>;
      ruby: HTMLAttributes<HTMLElement>;
      s: HTMLAttributes<HTMLElement>;
      samp: HTMLAttributes<HTMLElement>;
      script: HTMLAttributes<HTMLElement>;
      section: HTMLAttributes<HTMLElement>;
      select: HTMLAttributes<HTMLSelectElement>;
      small: HTMLAttributes<HTMLElement>;
      source: HTMLAttributes<HTMLSourceElement>;
      span: HTMLAttributes<HTMLSpanElement>;
      strong: HTMLAttributes<HTMLElement>;
      style: HTMLAttributes<HTMLStyleElement>;
      sub: HTMLAttributes<HTMLElement>;
      summary: HTMLAttributes<HTMLElement>;
      sup: HTMLAttributes<HTMLElement>;
      table: HTMLAttributes<HTMLTableElement>;
      tbody: HTMLAttributes<HTMLTableSectionElement>;
      td: HTMLAttributes<HTMLTableDataCellElement>;
      textarea: HTMLAttributes<HTMLTextAreaElement>;
      tfoot: HTMLAttributes<HTMLTableSectionElement>;
      th: HTMLAttributes<HTMLTableHeaderCellElement>;
      thead: HTMLAttributes<HTMLTableSectionElement>;
      time: HTMLAttributes<HTMLElement>;
      title: HTMLAttributes<HTMLTitleElement>;
      tr: HTMLAttributes<HTMLTableRowElement>;
      track: HTMLAttributes<HTMLTrackElement>;
      u: HTMLAttributes<HTMLElement>;
      ul: HTMLAttributes<HTMLUListElement>;
      var: HTMLAttributes<HTMLElement>;
      video: HTMLAttributes<HTMLVideoElement>;
      wbr: HTMLAttributes<HTMLElement>;

      // SVG
      svg: SVGAttributes<SVGElement>;

      animate: SVGAttributes<SVGElement>;
      animateTransform: SVGAttributes<SVGElement>;
      circle: SVGAttributes<SVGElement>;
      clipPath: SVGAttributes<SVGElement>;
      defs: SVGAttributes<SVGElement>;
      desc: SVGAttributes<SVGElement>;
      ellipse: SVGAttributes<SVGElement>;
      feBlend: SVGAttributes<SVGElement>;
      feColorMatrix: SVGAttributes<SVGElement>;
      feComponentTransfer: SVGAttributes<SVGElement>;
      feComposite: SVGAttributes<SVGElement>;
      feConvolveMatrix: SVGAttributes<SVGElement>;
      feDiffuseLighting: SVGAttributes<SVGElement>;
      feDisplacementMap: SVGAttributes<SVGElement>;
      feDistantLight: SVGAttributes<SVGElement>;
      feFlood: SVGAttributes<SVGElement>;
      feFuncA: SVGAttributes<SVGElement>;
      feFuncB: SVGAttributes<SVGElement>;
      feFuncG: SVGAttributes<SVGElement>;
      feFuncR: SVGAttributes<SVGElement>;
      feGaussianBlur: SVGAttributes<SVGElement>;
      feImage: SVGAttributes<SVGElement>;
      feMerge: SVGAttributes<SVGElement>;
      feMergeNode: SVGAttributes<SVGElement>;
      feMorphology: SVGAttributes<SVGElement>;
      feOffset: SVGAttributes<SVGElement>;
      fePointLight: SVGAttributes<SVGElement>;
      feSpecularLighting: SVGAttributes<SVGElement>;
      feSpotLight: SVGAttributes<SVGElement>;
      feTile: SVGAttributes<SVGElement>;
      feTurbulence: SVGAttributes<SVGElement>;
      filter: SVGAttributes<SVGElement>;
      foreignObject: SVGAttributes<SVGElement>;
      g: SVGAttributes<SVGElement>;
      image: SVGAttributes<SVGElement>;
      line: SVGAttributes<SVGElement>;
      linearGradient: SVGAttributes<SVGElement>;
      marker: SVGAttributes<SVGElement>;
      mask: SVGAttributes<SVGElement>;
      metadata: SVGAttributes<SVGElement>;
      path: SVGAttributes<SVGElement>;
      pattern: SVGAttributes<SVGElement>;
      polygon: SVGAttributes<SVGElement>;
      polyline: SVGAttributes<SVGElement>;
      radialGradient: SVGAttributes<SVGElement>;
      rect: SVGAttributes<SVGElement>;
      stop: SVGAttributes<SVGElement>;
      switch: SVGAttributes<SVGElement>;
      symbol: SVGAttributes<SVGElement>;
      text: SVGAttributes<SVGElement>;
      textPath: SVGAttributes<SVGElement>;
      tspan: SVGAttributes<SVGElement>;
      use: SVGAttributes<SVGElement>;
      view: SVGAttributes<SVGElement>;
    }
  }
}

export {};
