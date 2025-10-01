import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from "passport-local";
import env from "dotenv";
import bcrypt from 'bcrypt';

