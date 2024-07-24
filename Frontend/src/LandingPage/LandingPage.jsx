import React from 'react';
import { Button, CssBaseline, AppBar, Toolbar, Typography, Container, Grid, Box, Paper, styled, createTheme, ThemeProvider, Card, CardMedia, CardContent, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const theme = createTheme({
    palette: {
    primary: {
        main: '#ff5a5f',
    },
    secondary: {
        main: '#6d6d6d',
    },
    background: {
        default: '#ffffff',
        paper: '#f7f7f7',
    },
    text: {
        primary: '#333333',
        secondary: '#555555',
    },
    },
    typography: {
    fontFamily: 'Arial, sans-serif',
    },
    });

    const StyledContainer = styled(Container)(({ theme }) => ({
    padding: theme.spacing(2),
    margin: '0 2%',
    }));

    const HeroBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(8, 0),
    textAlign: 'center',
    backgroundColor: theme.palette.background.default,
    }));

    const FeatureBox = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    margin: theme.spacing(2, 0),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.paper,
    }));

    function LandingPage() {
    const navigate = useNavigate();
    const controls = useAnimation();
    const [ref, inView] = useInView();

    React.useEffect(() => {
    if (inView) {
        controls.start('visible');
    } else {
        controls.start('hidden');
    }
    }, [controls, inView]);

    const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static" color="default" elevation={0}>
            <Toolbar>
                <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
                DocuHealth
                </Typography>
                <Button color="inherit" onClick={() => navigate('/login')}>
                Doctor Portal Login
                </Button>
            </Toolbar>
            </AppBar>
            <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <HeroBox>
            <StyledContainer maxWidth="md">
                <Typography variant="h2" gutterBottom>
                Revolutionize Your Healthcare Management
                </Typography>
                <Typography variant="h5" color="textSecondary" paragraph>
                Discover how DocuHealth transforms your daily operations, enhancing efficiency and patient care.
                </Typography>
                <Button variant="contained" color="primary" size="large" onClick={() => navigate('/register')}>
                Start Free Trial
                </Button>
            </StyledContainer>
            </HeroBox>
            <StyledContainer maxWidth="lg">
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={8}>
                <Card>
                    <CardMedia
                        component="img"
                        height="500"
                        image="https://via.placeholder.com/800x300.png?text=Interactive+Demo"
                        alt="Interactive Demo"
                    />
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Interactive Demo
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Click to see DocuHealth in action and explore the features interactively.
                    </Typography>
                    </CardContent>
                    <CardActions>
                    <Button size="small" color="primary" startIcon={<PlayCircleOutlineIcon />}>
                        Watch Demo
                    </Button>
                    </CardActions>
                </Card>
                </Grid>
            </Grid>
            </StyledContainer>
            <StyledContainer maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                What Our Customers Say
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                <motion.div ref={ref} initial="hidden" animate={controls} variants={fadeInUp}>
                    <FeatureBox>
                    <Typography variant="subtitle1" component="p">
                        "DocuHealth has transformed our clinic's operations. The intuitive design and comprehensive features have made patient management a breeze."
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        - Dr. House
                    </Typography>
                    </FeatureBox>
                </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                <motion.div ref={ref} initial="hidden" animate={controls} variants={fadeInUp}>
                    <FeatureBox>
                    <Typography variant="subtitle1" component="p">
                        "The real-time updates and scheduling tools have significantly reduced our administrative workload. Highly recommend DocuHealth!"
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        - Dr. Who?
                    </Typography>
                    </FeatureBox>
                </motion.div>
                </Grid>
            </Grid>
            </StyledContainer>
            <StyledContainer maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Explore Our Features
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                <motion.div ref={ref} initial="hidden" animate={controls} variants={fadeInUp}>
                    <FeatureBox>
                    <Typography variant="h6">Patient Management</Typography>
                    <Typography>
                        Streamline patient records, appointments, and treatment plans all in one place.
                    </Typography>
                    </FeatureBox>
                </motion.div>
                </Grid>
                <Grid item xs={12} sm={4}>
                <motion.div ref={ref} initial="hidden" animate={controls} variants={fadeInUp}>
                    <FeatureBox>
                    <Typography variant="h6">Real-Time Updates</Typography>
                    <Typography>
                        Stay updated with real-time notifications about patient check-ins, appointment changes, and other critical updates.
                    </Typography>
                    </FeatureBox>
                </motion.div>
                </Grid>
                <Grid item xs={12} sm={4}>
                <motion.div ref={ref} initial="hidden" animate={controls} variants={fadeInUp}>
                    <FeatureBox>
                    <Typography variant="h6">Data Security</Typography>
                    <Typography>
                        Protect patient data with top-tier security measures and compliance with healthcare regulations.
                    </Typography>
                    </FeatureBox>
                </motion.div>
                </Grid>
                <Grid item xs={12} sm={4}>
                <motion.div ref={ref} initial="hidden" animate={controls} variants={fadeInUp}>
                    <FeatureBox>
                    <Typography variant="h6">Analytics & Reporting</Typography>
                    <Typography>
                        Gain insights into your operations with advanced analytics and customizable reports.
                    </Typography>
                    </FeatureBox>
                </motion.div>
                </Grid>
            </Grid>
            </StyledContainer>
            <StyledContainer maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Pricing Plans
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                <motion.div ref={ref} initial="hidden" animate={controls} variants={fadeInUp}>
                    <FeatureBox>
                    <Typography variant="h6">Basic</Typography>
                    <Typography variant="h5">$?/month</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Ideal for small clinics
                    </Typography>
                    <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                        Get Started
                    </Button>
                    </FeatureBox>
                </motion.div>
                </Grid>
                <Grid item xs={12} sm={4}>
                <motion.div ref={ref} initial="hidden" animate={controls} variants={fadeInUp}>
                    <FeatureBox>
                    <Typography variant="h6">Professional</Typography>
                    <Typography variant="h5">$?/month</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Perfect for growing practices
                    </Typography>
                    <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                        Get Started
                    </Button>
                    </FeatureBox>
                </motion.div>
                </Grid>
                <Grid item xs={12} sm={4}>
                <motion.div ref={ref} initial="hidden" animate={controls} variants={fadeInUp}>
                    <FeatureBox>
                    <Typography variant="h6">Enterprise</Typography>
                    <Typography variant="h5">Custom Pricing</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Solutions for large healthcare providers
                    </Typography>
                    <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                        Contact Us
                    </Button>
                    </FeatureBox>
                </motion.div>
                </Grid>
            </Grid>
            </StyledContainer>
            </div>
            <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
            <Typography variant="h6" align="center" gutterBottom>
                DocuHealth
            </Typography>
            <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                Empowering healthcare providers to deliver better patient care.
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
                © {new Date().getFullYear()} DocuHealth. All rights reserved.
            </Typography>
            </Box>
        </ThemeProvider>
    );
}

export default LandingPage;
