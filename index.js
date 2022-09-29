const express = require('express')
const app = express()
require('dotenv').config()
const port = 3000 // You can change this port if its already in use in any  other process

// const {performSolToSolSWAP} = require('./sol_sol');
// performSolToSolSWAP();
const { performCrossChainEVMToEVM } = require('./examples/evm_evm_cross_chain');

performCrossChainEVMToEVM();