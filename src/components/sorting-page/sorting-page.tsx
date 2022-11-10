import React, { useEffect, useState } from 'react';

import { SHORT_DELAY_IN_MS } from '../../constants/delays';
import { randomArr, SortingArray } from './utils';

import { 
  Direction, 
  ElementStates, 
  TSortingResult 
} from '../../types';

import { SolutionLayout } from '../ui/solution-layout/solution-layout';
import { RadioInput } from '../ui/radio-input/radio-input';
import { Button } from '../ui/button/button';
import { Column } from '../ui/column/column';

import styles from './sorting.module.css';

export const SortingPage: React.FC = () => {
  const [method, setMethod] = useState<string>('choice');
  const [direction, setDirection] = useState<Direction>(Direction.Ascending);
  const [result, setResult] = useState<TSortingResult>([]);
  const [solution, setSolution] = useState<TSortingResult[]>([]);
  const [step, setStep] = useState(-1);
  const [loader, setLoader] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const method = e.target.value;
    setMethod(method);
  };

  const handleAscendingClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (result.length > 0) {
      setDirection(Direction.Ascending);

      const sortableArray = new SortingArray(result, method, Direction.Ascending);
      const iterations = sortableArray.getSteps();
      if(iterations) {
        setSolution(iterations);
      }

      startVisualization();
    }
  };

  const handleDescendingClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (result.length > 0) {
      setDirection(Direction.Descending);

      const sortableArray = new SortingArray(result, method, Direction.Descending);
      const iterations = sortableArray.getSteps();
      if(iterations) {
        setSolution(iterations);
      }

      startVisualization();
    }
  };

  const handleSetNewArray = () => {
    setResult(
      randomArr().map((item) => {
        return { value: item, state: ElementStates.Default };
      })
    );
  };

  const startVisualization = () => {
    setLoader(true);
    setStep(0);
  };

  useEffect(() => {
    const takeNextStep = () => {
      if (step < 0) {
        return;
      }
  
      if (step >= solution.length) {
        setLoader(false);
        return;
      }
  
      setResult(
        solution[step].map((item) => {
          return { ...item };
        })
      );
      setStep((prevStep) => prevStep + 1);
    };

    window.setTimeout(() => takeNextStep(), SHORT_DELAY_IN_MS);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <SolutionLayout title="Сортировка массива">
      <form className={styles.form}>
        <fieldset className={styles.combination}>
          <RadioInput
            name={'kind'}
            onChange={handleChange}
            value={'choice'}
            checked={method === 'choice'}
            label={'Выбор'}
            disabled={loader}
          />
          <RadioInput
            name={'kind'}
            onChange={handleChange}
            value={'bubble'}
            checked={method === 'bubble'}
            label={'Пузырек'}
            disabled={loader}
          />
        </fieldset>
        <fieldset className={styles.combination}>
          <Button
            type={'submit'}
            text={'По возрастанию'}
            sorting={Direction.Ascending}
            value={'ascending'}
            style={{ minWidth: '205px' }}
            onClick={handleAscendingClick}
            isLoader={loader && direction === Direction.Ascending}
            disabled={loader && direction === Direction.Descending}
          />
          <Button
            type={'submit'}
            text={'По убыванию'}
            sorting={Direction.Descending}
            value={'descending'}
            style={{ minWidth: '205px' }}
            onClick={handleDescendingClick}
            isLoader={loader && direction === Direction.Descending}
            disabled={loader && direction === Direction.Ascending}
          />
        </fieldset>
        <Button
          type={'button'}
          text={'Новый массив'}
          onClick={handleSetNewArray}
          style={{ minWidth: '205px' }}
          disabled={loader}
        />
      </form>

      <ul className={styles.results}>
        {result &&
          result.length > 0 &&
          result.map((item, index) => {
            return (
              <li key={index}>
                <Column index={item.value} state={item.state} />
              </li>
            );
          })}
      </ul>
    </SolutionLayout>
  );
};
