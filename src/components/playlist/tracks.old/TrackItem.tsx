import { useRef } from 'react';
import styles from './Track.module.css';
import { useEffect } from 'react';
import { useState } from 'react';
import { ChannelDefinition, Checkpoint, PatternDefinition, TrackDefinition } from '../../../models/models';
import { useDroppable } from '@dnd-kit/core';

const calcTrackBounds = (trackInfo: TrackDefinition, pixelsPerMs: number) => {
    const channels = trackInfo.patterns.map(pat=>pat.channels).flat();
    console.log(channels)
    const min = channels?.reduce((x: number, chan: ChannelDefinition) => Math.min(chan.checkpoints.reduce((c: number, note: Checkpoint)=>Math.min(c, note.time.start), 999999), 999999), 9999999) || 0;
    const max = channels?.reduce((x: number, chan: ChannelDefinition) => Math.max(chan.checkpoints.reduce((c: number, note: Checkpoint)=>Math.max(c, note.time.end), min), min), min) || 0;
    const start = channels?.reduce((x: number, chan: ChannelDefinition) => Math.min(chan.checkpoints.reduce((c: number, note: Checkpoint)=>Math.min(c, note.time.start), max), max), max) || 0;
    const end = channels?.reduce((x: number, chan: ChannelDefinition) => Math.max(chan.checkpoints.reduce((c: number, note: Checkpoint)=>Math.max(c, note.time.start), min), min), min) || 0;
    return {
        start: start*pixelsPerMs,
        end: end*pixelsPerMs,
        width: (max-min)*pixelsPerMs
    }
}

const mapNotesToFrequencies = (trackInfo: TrackDefinition) => {
    const channels = trackInfo.patterns.map(pat=>pat.channels).flat();
    const minFreq = channels.reduce((x: number, chan: ChannelDefinition) => Math.min(chan.checkpoints.reduce((c: number, note: Checkpoint) => Math.min(c, note.note), 20000), 20000), 20000);
    const maxFreq = channels.reduce((x: number, chan: ChannelDefinition) => Math.max(chan.checkpoints.reduce((c: number, note: Checkpoint) => Math.max(c, note.note), minFreq), minFreq), minFreq);
    return {min: minFreq, max:maxFreq};
}

const normalizedFrequencies = (trackInfo: TrackDefinition, range: {min: number, max:number}) => {
    const r = 100 / (range.max - range.min+0.000000001);
    const channels = trackInfo.patterns.map(pat=>pat.channels).flat();
    const normalized = channels.map((chan: ChannelDefinition)=>chan.checkpoints?.map(cp=>(cp.note-range.min)*r))?.flat();
    return normalized;
}

export const TrackItem = ({trackInfo, pixelsPerMs, onTrackDblClick=()=>{} } : { trackInfo: TrackDefinition, pixelsPerMs: number, onTrackDblClick: ()=>void}) => {

  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D|null|undefined>(null);

  const bounds = calcTrackBounds(trackInfo, pixelsPerMs);
  const freqRange = mapNotesToFrequencies(trackInfo);
  const normalized = normalizedFrequencies(trackInfo, freqRange);

  const { isOver, setNodeRef } = useDroppable({
    id: 'track-01'
  })

  useEffect(()=>{
    setCtx(canvasRef.current?.getContext('2d'));
  }, [])

  useEffect(()=>{
    if(ctx && canvasRef.current && normalized.length){
      ctx.clearRect(0,0,canvasRef.current.width, canvasRef.current.height);
      ctx.canvas.width = bounds.width;
      ctx.strokeStyle='red';
      trackInfo.patterns?.forEach((pat: PatternDefinition)=>{
        pat.channels[0].checkpoints?.forEach((cp,i)=>{
          const x = (cp.time.start)*pixelsPerMs;
          const w = (cp.time.end - cp.time.start)*pixelsPerMs;
          const y = ctx.canvas.height*(normalized[i]??0/100);
          console.log(x, y, w);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x+w,y);
          ctx.stroke();
        })
      })
    }
  }, [trackInfo.patterns, normalized, bounds, ctx, pixelsPerMs])

  return (
    <div ref={setNodeRef} onDoubleClick={onTrackDblClick} className={`${styles['track-wrapper']} ${styles['timeline-track-item']}`} style={{left: bounds.start, width: bounds.width}}>
      { isOver ? 'aaaaah': ''}
      <canvas height="32" ref={canvasRef}></canvas>
    </div>
  )
}
