import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import { Formik, Field, Form } from 'formik';
import {
  fieldToTextField,
  TextField,
  TextFieldProps,
  Select,
} from 'formik-material-ui';
import MenuItem from '@material-ui/core/MenuItem';
import * as Yup from 'yup';
import trans from 'score-config/translate';
import { keys, meters } from 'score-config/constValue';

class PageSettingDialog extends React.Component {
  state = {
    activeIndex: 0,
  };

  handleClose = () => {
    this.props.actions.switchShow({ showSettings: false });
  };

  renderPageSettings = () => {
    const formSchema = Yup.object().shape({
      title: Yup.string().max(20, trans.pageSettingsVali.titleTooLong),
    });

    const headerData = this.props.musicData.get('header');

    const title = headerData.get('title');
    const subtitle = headerData.get('subtitle');
    const subtitle2 = headerData.get('subtitle2');
    const wordAuthor = headerData.get('wordAuthor');
    const songAuthor = headerData.get('songAuthor');
    const speed = headerData.get('speed');
    const emotion = headerData.get('emotion');
    const key = headerData.get('key');
    const beats = headerData.get('beats');

    return (
      <Formik
        initialValues={{
          title,
          subtitle,
          subtitle2,
          speed,
          wordAuthor,
          songAuthor,
          emotion,
          key,
          beats,
        }}
        validationSchema={formSchema}
        onSubmit={(values) => {
          this.props.actions.setHeader(values);
          this.handleClose();
        }}
        render={({
          submitForm,
        }) => (
          <Form>
            <DialogContent>
              <Field
                label={trans.pageSettings.title}
                name="title"
                fullWidth
                autoFocus
                component={TextField}
              />
              <Field
                label={trans.pageSettings.subtitle}
                name="subtitle"
                fullWidth
                autoFocus
                component={TextField}
              />
              <Field
                label={trans.pageSettings.subtitle2}
                name="subtitle"
                fullWidth
                autoFocus
                component={TextField}
              />
              <Field
                label={trans.pageSettings.speed}
                name="speed"
                fullWidth
                autoFocus
                component={TextField}
              />
              <Field
                label={trans.pageSettings.wordAuthor}
                name="wordAuthor"
                fullWidth
                autoFocus
                component={TextField}
              />
              <Field
                select
                label={trans.pageSettings.key}
                name="key"
                fullWidth
                component={TextField}
              >
                {keys.map(keyValue => (
                  <MenuItem key={keyValue} value={keyValue}>
                    {keyValue}
                  </MenuItem>
                ))}
              </Field>
              <Field
                select
                label={trans.pageSettings.beats}
                name="beats"
                fullWidth
                component={TextField}
              >
                {meters.map(meterValue => (
                  <MenuItem key={meterValue} value={meterValue}>
                    {meterValue}
                  </MenuItem>
                ))}
              </Field>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                取消
              </Button>
              <Button onClick={submitForm} color="primary">
                应用
              </Button>
            </DialogActions>
          </Form>
        )}
      />
    );
  }

  renderTabContent = () => {
    switch (this.state.activeIndex) {
    case 0:
      return this.renderPageSettings();
    default:
      return null;
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.uiData.get('showSettings')}
        onClose={() => {
          this.handleClose();
        }}
        disableBackdropClick
      >
        <Tabs
          value={this.state.activeIndex}
          indicatorColor="primary"
          textColor="primary"
          onChange={(event, value) => {
            this.setState({
              activeIndex: value,
            });
          }}
        >
          <Tab label="Page Settings" />
          <Tab label="setting" />
        </Tabs>
        {
          this.renderTabContent()
        }
      </Dialog>
    );
  }
}

export default PageSettingDialog;
