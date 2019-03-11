#!/usr/bin/env python
# -*- coding:utf-8 -*-


# Time: 2019/3/6 8:46
__author__ = 'Peter.Fang'
import os
import logging
import datetime
import traceback
from django.http import JsonResponse

from df2 import settings

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _log_init(trace, file_name):
    trace_len = len(trace)
    trace = trace[trace_len - 2][:2]
    call_name = ((trace[0].split('/'))[-1])

    path, name = os.path.split(call_name)
    dir_name = os.path.basename(path)
    logfile_head = file_name or '_'.join((dir_name, name))

    line_id = trace[1]
    log_file = settings.BASE_DIR + os.sep + 'log/' + logfile_head + '.log'

    logger = logging.getLogger(logfile_head)  # 获取logger
    logger.setLevel(logging.DEBUG)

    handler = logging.FileHandler(log_file)

    fmt = '[%(asctime)s %(call_name)s %(line_id)d] %(levelname)s: %(message)s'

    formatter = logging.Formatter(fmt)  # 实例化formatter
    handler.setFormatter(formatter)  # 为handler添加formatter

    logger.addHandler(handler)  # 为logger添加handler

    return logger, handler, {'line_id': line_id, 'call_name': call_name}


def _log_close(handle, logger):
    try:
        handle.flush()
        logger.removeHandler(handle)
        logging.shutdown()
    except Exception:
        pass


def debug(msg, file_name=''):
    logger, handler, d = _log_init(traceback.extract_stack(), file_name)
    logger.debug(msg, extra=d)
    _log_close(handler, logger)


def info(msg, file_name=''):
    logger, handler, d = _log_init(traceback.extract_stack(), file_name)
    logger.info(msg, extra=d)
    _log_close(handler, logger)


def json_response(flag, data=None, message=''):
    data = data or []
    result = 'success' if flag else 'failed'
    result_format = {
        "result": result,
        "data": data,
        "message": message
    }
    return JsonResponse(result_format)


def excel_float(data):
    return float(str(data).replace(',', ''))


def get_today(day=0, str_flag=True):
    today = datetime.date.today() + datetime.timedelta(days=day)
    if str_flag:
        return today.strftime('%Y-%m-%d')
    return today
