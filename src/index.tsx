import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import CronJob from './CronJob';
import DaemonSet from './DaemonSet';
import Deployment from './Deployment';
import Job from './Job';
import Pod from './Pod';
import StatefulSet from './StatefulSet';


const root = createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />}>
                    <Route path='/cronjob' element={<CronJob />}></Route>
                    <Route path='/daemonset' element={<DaemonSet />}></Route>
                    <Route path='/deployment' element={<Deployment />}></Route>
                    <Route path='/job' element={<Job />}></Route>
                    <Route path='/pod' element={<Pod />}></Route>
                    <Route path='/statefulset' element={<StatefulSet />}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
