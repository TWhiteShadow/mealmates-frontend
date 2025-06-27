"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { BrowserView, MobileView } from 'react-device-detect';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { FC } from 'react';

type CustomTooltipProps = {
  trigger?: React.ReactNode;
  content?: React.ReactNode;
};

export const CustomTooltip: FC<CustomTooltipProps> = ({trigger, content}) => {
  return (
    <>
      <BrowserView>
        <Tooltip>
            <TooltipTrigger asChild>
                {trigger || "Open"}
            </TooltipTrigger>
            <TooltipContent>
                {content || "add a content here"}
            </TooltipContent>
        </Tooltip>
      </BrowserView>
      <MobileView>
          <Popover>
              <PopoverTrigger className="inline-block ml-1">
                  {trigger || "Open"}
              </PopoverTrigger>
              <PopoverContent className='bg-primary text-white'>
                {content || "add a content here"}
              </PopoverContent>
          </Popover>
      </MobileView>
    </>
  );
}
