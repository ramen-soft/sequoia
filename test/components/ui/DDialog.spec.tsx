import React from 'react';
import { render } from '@testing-library/react';
import { DDialog } from '../../../src/components/ui/DDialog'

describe('Testing of <DDialog />', () => {   
    
    test('should display the title provided in props', () => { 
        const title = 'Test Title';
        const { container, getByText } = render(<DDialog title={title} />)

        const titleEl = container.querySelector('.dialog-title-text');
        expect(titleEl).toBeTruthy()
        expect(titleEl?.innerHTML).toContain(title);
    })

    test('should render children elements', () => {
        const text = 'Testing';
        const { container } = render(<DDialog title="My Dialog"> <p>{text}</p> </DDialog>);
        const p = container.querySelector('.dialog-body')?.querySelector('p');
        expect(p).toBeTruthy();
        expect(p?.innerHTML).toContain(text);
    })
})